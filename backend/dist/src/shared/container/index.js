"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsyringe_1 = require("tsyringe");
require("@modules/users/providers/index");
require("./providers/index");
var AppointmentsRepository_1 = __importDefault(require("@modules/appointments/infra/typeorm/repositories/AppointmentsRepository"));
var UsersRepository_1 = __importDefault(require("@modules/users/infra/typeorm/repositories/UsersRepository"));
var UserTokenRepository_1 = __importDefault(require("@modules/users/infra/typeorm/repositories/UserTokenRepository"));
var NotificationsRepository_1 = __importDefault(require("@modules/notifications/infra/typeorm/repositories/NotificationsRepository"));
tsyringe_1.container.registerSingleton('AppointmentsRepository', AppointmentsRepository_1.default);
tsyringe_1.container.registerSingleton('UsersRepository', UsersRepository_1.default);
tsyringe_1.container.registerSingleton('UserTokenRepository', UserTokenRepository_1.default);
tsyringe_1.container.registerSingleton('NotificationsRepository', NotificationsRepository_1.default);
