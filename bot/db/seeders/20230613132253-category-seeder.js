'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
        {
          name: 'iPhone',
          url: 'https://jabko.ua/zaporizhzhia/rus/iphone/',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      {
        name: 'iPad',
        url: 'https://jabko.ua/zaporizhzhia/rus/ipad/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mac',
        url: 'https://jabko.ua/zaporizhzhia/rus/mac/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Apple Watch',
        url: 'https://jabko.ua/zaporizhzhia/rus/apple-watch/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AirPods',
        url: 'https://jabko.ua/zaporizhzhia/rus/apple-airpods/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Гаджеты',
        url: 'https://jabko.ua/zaporizhzhia/rus/gadzheti-i-drugoe/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Аксессуары',
        url: 'https://jabko.ua/zaporizhzhia/rus/aksessuari/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Apple б/у',
        url: 'https://jabko.ua/zaporizhzhia/rus/b-u-apple/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
