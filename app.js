import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import connectDB from "./connection/db.js";
import comment from "./models/comment.js";
import tag_list from "./models/tag_list.js";
import post from "./models/post.js";


//config env
dotenv.config();

//connect data
connectDB();

// rest object
const app = express()

//middelwares
app.use(cors())
app.use(express.json())

// Set up Pug template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: true }));

//Trang chủ
app.get("/", async(req, res) =>{
    const posts = await post.find({});
    res.render('home', {posts});
})

//Tạo bài post mới
app.get('/posts/new', (req, res) => {
    res.render('createpost');
  });
  
app.post('/posts/new', async (req, res) => {
  try {
      const { title, description, url, likes, post_by } = req.body;
      const newPost = new post({ title, description, url, likes, post_by });
      await newPost.save();   
      res.redirect('/');
  } catch (error) {
      console.error('Lỗi khi tạo post mới:', error);
      res.status(500).send('Lỗi kết nối');
  }
});

// Sủa bài post
app.get('/posts/:postId/edit', async (req, res) => {
    try {
      const postId = req.params.postId;
      const posts = await post.findById(postId);
      res.render('editpost', { posts });
    } catch (error) {
        console.error('Lỗi khi cập nhật post:', error);
        res.status(500).send('Lỗi kết nối');
    }
  });
  app.post('/posts/:postId/edit', async (req, res) => {
    try {
      const postId = req.params.postId;
      const { title, description, url, likes, post_by } = req.body;
      const posts = await post.findByIdAndUpdate(
        postId,
        { title, description, url, likes, post_by },
        { new: true } 
      );
      res.redirect('/');
    } catch (error) {
      console.error('Lỗi khi cập nhật post:', error);
      res.status(500).send('Lỗi kết nối');
    }
  });

// Xóa post và xóa tất cả dữ liệu của comment và tag
app.get('/posts/:postId/delete', async (req, res) => {
  try {
    const postId = req.params.postId;
    // Xóa các comment thuộc bài viết
    await comment.deleteMany({ post_id: postId });
    // Xóa các tag thuộc bài viết
    await tag_list.deleteMany({ post_id: postId });
    // Xóa bài viết
    const deletedPost = await post.findByIdAndRemove(postId);
    res.redirect('/');
  } catch (error) {
    console.error('Lỗi khi xóa bài viết và dữ liệu liên quan:', error);
    res.status(500).send('Lỗi khi xóa bài viết và dữ liệu liên quan');
  }
});
// Trang comment
app.get('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await comment.find({ post_id: postId });
    const posts = await post.findById(postId);
    res.render('comments', {comments, posts});
  } catch (error) {
    console.error('Lỗi dữ liệu:', error);
    res.status(500).send('Lỗi');
  }
});

// Tạo comment
app.get('/posts/:postId/comments/new', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await comment.find({ post_id: postId });
    res.render('createcomment', { comments, postId });
  } catch (error) {
    console.error('Lỗi dữ liệu:', error);
    res.status(500).send('Lỗi');
  }
});

app.post('/posts/:postId/comments/new', async (req, res) => {
  try {
    const {post_id, by_user, message, date_time, likes} = req.body;
    const newComment = new comment({ post_id, by_user, message, date_time, likes});
    await newComment.save();   
    res.redirect(`/posts/${post_id.toString()}/comments`);
  } catch (error) {
      console.error('Lỗi khi tạo comment mới:', error);
      res.status(500).send('Lỗi kết nối');
  }
})

// Sửa comment
app.get('/posts/comments/:cmtId/edit', async (req, res) => {
  try {
    const cmtId = req.params.cmtId;
    const comments = await comment.findById(cmtId);
    res.render('editcomment', { comments });
  } catch (error) {
      console.error('Lỗi khi cập nhật comments:', error);
      res.status(500).send('Lỗi kết nối');
  }
});
app.post('/posts/comments/:cmtId/edit', async (req, res) => {
  try {
    const cmtId = req.params.cmtId;
    const {post_id, by_user, message, date_time, likes} = req.body;
    const comments = await comment.findByIdAndUpdate(
      cmtId,
      { post_id, by_user, message, date_time, likes },
      { new: true } 
    );
    res.redirect(`/posts/${post_id.toString()}/comments`);
  } catch (error) {
    console.error('Lỗi khi cập nhật comments:', error);
    res.status(500).send('Lỗi kết nối');
  }
});

// Xóa comments
app.get('/posts/comments/delete/:cmtId', async (req, res) => {
  try {
    const deletecmt = await comment.findByIdAndRemove(req.params.cmtId);
    res.redirect(`/posts/${deletecmt.post_id.toString()}/comments`);
  } catch (error) {
    console.error('Lỗi khi xóa bình luận:', error);
    res.status(500).send('Lỗi kết nối');
  }
});

// Trang taglist
app.get('/posts/:postId/taglists', async (req, res) => {
  try {
    const postId = req.params.postId;
    const taglists = await tag_list.find({ post_id: postId });
    const posts = await post.findById(postId);
    res.render('taglists', {taglists, posts});
  } catch (error) {
    console.error('Lỗi dữ liệu:', error);
    res.status(500).send('Lỗi');
  }
});

// Tạo taglist
app.get('/posts/:postId/taglists/new', async (req, res) => {
  try {
    const postId = req.params.postId;
    const taglists = await tag_list.find({ post_id: postId });
    res.render('createtaglist', { taglists, postId });
  } catch (error) {
    console.error('Lỗi dữ liệu:', error);
    res.status(500).send('Lỗi');
  }
});

app.post('/posts/:postId/taglists/new', async (req, res) => {
  try {
    const {post_id, tag} = req.body;
    const newTaglist = new tag_list({ post_id, tag});
    await newTaglist.save();   
    res.redirect(`/posts/${post_id.toString()}/taglists`);
  } catch (error) {
      console.error('Lỗi khi tạo taglist mới:', error);
      res.status(500).send('Lỗi');
  }
})

// Sửa taglist
app.get('/posts/taglists/:tgId/edit', async (req, res) => {
  try {
    const tgId = req.params.tgId;
    const taglists = await tag_list.findById(tgId);
    res.render('edittaglist', {taglists});
  } catch (error) {
      console.error('Lỗi khi cập nhật taglists:', error);
      res.status(500).send('Lỗi');
  }
});
app.post('/posts/taglists/:tgId/edit', async (req, res) => {
  try {
    const tgId = req.params.tgId;
    const {post_id, tag} = req.body;
    const taglists = await tag_list.findByIdAndUpdate(
      tgId,
      { post_id, tag},
      { new: true } 
    );
    res.redirect(`/posts/${post_id.toString()}/taglists`);
    } catch (error) {
      console.error('Lỗi khi cập nhật taglists:', error);
      res.status(500).send('Lỗi');
    }
});

// Xóa taglist
app.get('/posts/taglists/delete/:tgId', async (req, res) => {
  try {
    const deletetg = await tag_list.findByIdAndRemove(req.params.tgId);
    res.redirect(`/posts/${deletetg.post_id.toString()}/taglists`);
  } catch (error) {
    console.error('Lỗi khi xóa taglist', error);
    res.status(500).send('Lỗi');
  }
});

// port
const PORT = process.env.PORT || 8080

// run server
app.listen(PORT, () =>{
    console.log(
        `Server dang chay tren cong ${PORT}`.bgCyan.white
        );
})