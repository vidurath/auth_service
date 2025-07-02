module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
