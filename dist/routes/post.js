"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_js_1 = __importDefault(require("../controllers/post.js"));
router.get('/', post_js_1.default.getPosts);
router.get('/:id', post_js_1.default.getPostById);
router.post('/', post_js_1.default.addPost);
router.put('/:id', post_js_1.default.updatePost);
module.exports = router;
//# sourceMappingURL=post.js.map