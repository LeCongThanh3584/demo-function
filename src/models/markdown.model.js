"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Markdown.init(
    {
      // id: DataTypes.INTEGER,
      contentHTML: DataTypes.TEXT,
      contentMarkdown: DataTypes.TEXT,
      description: DataTypes.TEXT,
      doctor_id: DataTypes.INTEGER,
      specialty_id: DataTypes.INTEGER,
      clinic_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Markdown",
    }
  );
  return Markdown;
};
