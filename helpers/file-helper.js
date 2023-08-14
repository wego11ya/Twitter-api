const fs = require("fs"); // 引入 fs 模組
const createReadStream = fs.createReadStream;
const { newError } = require("./error-helper");
const { ImgurClient } = require("imgur");
const client = new ImgurClient({ clientId: process.env.CLIENT_ID });

const imgurFileHandler = async (file) => {
  try {
    if (!file) return null;
    const response = await client.upload({
      image: createReadStream(file.path),
      type: "stream",
    });
    return response?.data.link || null;
  } catch (err) {
    throw newError(404, err.message);
  }
};
module.exports = {
  imgurFileHandler,
};
