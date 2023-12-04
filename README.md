<img src="https://i.imgur.com/WpCRgvG.png" align='right'>

# Momoi-Bot ✨
A Discord bot for the Blue Archive game, using the API from [torikushiii](https://github.com/torikushiii/BlueArchiveAPI). If you could, please support both of us ❤
# Installing🔭
**Node.js 16 or higher is required**

To install all libraries, you can use the following commands:
```bash
# NPM
npm install

# yarn
yarn
```
To use the bot, you need to create a .env file with the following commands:
```bash
# create .env file
touch .env
```
.env content should be like this:
```env
TOKEN=YOUR_TOKEN_HERE
API=https://api.ennead.cc/buruaka
```
Add your Bot client ID and your Server ID in
``
.config/config.json
``
# Run the bot 🌱
To run Momoi-bot, you can use a few ways:
```bash
# PM2
yarn global add pm2

pm2 start ./src/index.js --name "ANYTHING"

# Nodemon
yarn global add nodemon

nodemon ./src/index.js

# Node
Node ./src/index.js

# or....
npm run start
# and to stop
npm run stop
```
## Footer
I hope you have a good time with my bot. Feel free to contribute or contact me if you need something!
