function blogSorter(blogs, option) {
  const options = ["Newest", "Oldest", "Likes"];

  if (!options.includes(option)) {
    return null;
  }
  switch (option) {
    case "Newest":
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "Oldest":
      blogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "Likes":
      blogs.sort((a, b) => b.likes.length - a.likes.length);
      break;
    default:
      break;
  }
  return blogs;
}

module.exports = blogSorter;
