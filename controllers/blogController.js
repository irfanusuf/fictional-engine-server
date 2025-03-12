const { Blog } = require("../models/blogModel");
const { messageHandler } = require("../utils/messageHandler");



const getCreateBlogPage = (req,res) =>{

    res.render("createBlog")
}


const getAllBlogs = async (req,res) =>{

    const userId = req.userId
    const blogs = await Blog.find({author : userId}).lean()

    return res.render("blogsList" , {blogsARR : blogs})
}

const getBlogs = async (req,res) =>{

 
  const blogs = await Blog.find().lean()

  return res.render("blogs" , {blogsARR : blogs})
}

const getBlogbyId = async (req,res) =>{

  const {blogId} = req.params
 
  const blog = await Blog.findById(blogId).lean()

  return res.render("blog" , {blogTitle : blog.blogTitle , blogDesc : blog.blogDesc})
}



const createBlog = async (req, res) => {
  try {
    const userId = req.userId;

    const { blogTitle, blogDesc, blogDescShort, blogImageUrl, category } =req.body;


    if (!req.body) {
        messageHandler(res , 400 , "All Blog details Are required!")
    }
    const newBlog = await Blog.create({
      blogTitle,
      blogDesc,
      blogDescShort,
      blogImageUrl,
      category,
      author : userId
    });

    if(newBlog){
        messageHandler(res,200,"Blog created Succesfully")
    }else{
        messageHandler(res , 500 , "Some Error" )
    }

  } catch (error) {
    console.log(error);
  }
};





module.exports = { createBlog  , getCreateBlogPage , getAllBlogs , getBlogs , getBlogbyId};
