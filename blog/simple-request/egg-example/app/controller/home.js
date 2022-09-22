"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "hi, egg";
  }
  async post() {
    const { ctx } = this;
    ctx.body = "this is post";
  }
}

module.exports = HomeController;
