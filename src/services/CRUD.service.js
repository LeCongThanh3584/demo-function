import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};

exports.createNewUser = async (data) => {
  let hashPasswordFromBcrypt = await hashUserPassword(data.password);
  console.log(data);
  console.log(hashPasswordFromBcrypt);
};
