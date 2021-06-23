module.exports = async () => {
  console.log(`killing process ${global.__SERVER__.pid}`);
  process.kill(global.__SERVER__.pid);
};
