const { Midea, Site, Page, MideaPage, User} = require('../models');
const fs = require('fs');
const s3Client = require('../services/s3Service');
const axios = require('axios');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeStatic = require('ffprobe-static');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const contentController = {
    async getPageTitle(url) {
        try {

            // Coleta o título da página
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            let title = $('title').text();
            title = title.replace(/[\s\n]+/g, ' ').trim(); // Remove espaços e quebras de linha extras
            return title || 'Untitled'; // Retorna 'Untitled' se não houver título na página
        } catch (error) {
            console.error('Erro ao obter o título da página:', error);
            return 'Untitled';
        }
    },

    async create(req, res) {
        try {
            const email = req.user.email;

            if (typeof email !== 'string') {
                throw new Error('Email is not a valid string');
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const accountId = user.account_id;

            const { typePage, url } = req.body;
            const file = req.file;

            // Cria o objeto Midea
            const midea = await Midea.create({ name: req.body.name,});

            // Upload do arquivo para o S3 usando o ID do Midea como nome do arquivo
            let uploadParams;
            let filePath = '';

            if (file.buffer) {
                // Se estiver usando memoryStorage
                const extension = mime.extension(file.mimetype);
                filePath = `videos/${midea.id}.${extension}`
                uploadParams = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: filePath, // Inclui a extensão obtida
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
            } else {
                // Se estiver usando diskStorage
                const extension = mime.extension(file.mimetype); // Obtém a extensão com base no mimetype
                const fileStream = fs.createReadStream(file.path);
                filePath = `videos/${midea.id}.${extension}`
                uploadParams = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: filePath,
                    Body: fileStream,
                    ContentType: file.mimetype,
                };
            }

            const command = new PutObjectCommand(uploadParams);
            const uploadResult = await s3Client.send(command);
            const imageExtension = 'png';
            const imageFileName = `${midea.id}.${imageExtension}`;
            const imageTempPath = path.join(__dirname, '..', 'thumbnails', imageFileName);


            // Coleta  a screenshot
            ffmpeg(file.path)
                .screenshots({
                    timestamps: ['0.0'], // Captura o primeiro frame
                    filename: imageFileName,
                    folder: path.dirname(imageTempPath),
                    size: '320x240', // Tamanho da imagem de miniatura
                })
                .on('end', async () => {
                    const imageUploadParams = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `images/${imageFileName}`,
                        Body: fs.createReadStream(imageTempPath),
                        ContentType: 'image/png',
                    };

                    const imageCommand = new PutObjectCommand(imageUploadParams);
                    const imageUploadResult = await s3Client.send(imageCommand);

                    ffmpeg.ffprobe(file.path, async (err, metadata) => {
                        if (err) {
                            console.error('Erro ao obter os metadados do vídeo:', err);
                            return res.status(500).json({ message: 'Erro ao processar o vídeo.' });
                        }

                        const { duration } = metadata.format;
                        const { width, height } = metadata.streams[0]; // Assume que o primeiro stream é o de vídeo

                        // Atualiza o objeto Midea com os dados obtidos
                        midea.path = filePath; // Caminho do local do vídeo
                        midea.duration = duration;
                        midea.height = height;
                        midea.width = width;
                        midea.size = file.size;
                        midea.file_type = file.mimetype;
                        midea.path_image = `images/${imageFileName}`; // Caminho local da imagem
                        midea.user_id = user.id;
                        midea.account_id = accountId;
                        await midea.save();

                        res.status(200).json({ message: 'Upload e processamento realizados com sucesso!', midea });
                    });
                })
                .on('error', (err) => {
                    console.error('Erro ao capturar o frame do vídeo:', err);
                    res.status(500).json({ message: 'Erro ao capturar o frame do vídeo.' });
                });


            const title = await contentController.getPageTitle(url);

            // Cria ou verifica se já existe o Site
            let site = await Site.findOne({
                where: {
                    url: req.body.url,
                    user_id: user.id,
                    account_id: accountId
                }
            });

            if (!site) {
                site = await Site.create({
                    name: title,
                    url: req.body.url,
                    user_id: user.id,
                    account_id: accountId
                });
            }


            // Cria ou verifica se já existe a Page
            let page = await Page.findOne({
                where: {
                    site_id: site.id,
                    user_id: user.id,
                    account_id: accountId
                }
            });

            if (!page) {
                page = await Page.create({
                    site_id: site.id,
                    type: req.body.typePage,
                    user_id: user.id,
                    account_id: accountId
                });
            }

            // Cria ou verifica se já existe a relação MideaPage
            let mideaPage = await MideaPage.findOne({
                where: {
                    midea_id: midea.id,
                    page_id: page.id,
                    account_id: accountId,
                    user_id: user.id
                }
            });

            if (!mideaPage) {
                await MideaPage.create({
                    midea_id: midea.id,
                    page_id: page.id,
                    user_id: user.id,
                    account_id: accountId
                });
            }

        }  catch (error) {
            console.error('Erro ao processar o upload:', error);
            res.status(500).json({ message: 'Erro ao processar o upload.' });
        }
    }
};
module.exports = contentController;
