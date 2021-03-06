const Comment = require("../db").Comment;

getAll = async Messages => {
  let dataSend = [];
  for (let i = 0; i < Messages.length; i++) {
    const element = Messages[i];
    let obj = {
      _id: element["_id"],
      title: element["title"],
      nickname: element["nickname"],
      email: element["email"],
      content: element["content"],
      createtime: element["createtime"],
      phone: element["phone"],
      isreplied: element["isreplied"],
      replycontent: element["replycontent"],
      replytime: element["replytime"]
    };
    dataSend.push(obj);
  }
  let dataReplied = [];
  dataSend.forEach(element => {
    if (element.isreplied) {
      dataReplied.push(element);
    }
  });
  return { dataSend, dataReplied };
};

module.exports = {
  getMessage: async ctx => {
    let page = ctx.request.body.page;
    let limit = ctx.request.body.limit;
    if (!page) {
      page = 1;
    }

    let dataSend = await Comment.find()
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    let dataReplied = await Comment.find({ isreplied: true })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    let totalLength = await Comment.find({ isreplied: true }).countDocuments();
    ctx.body = {
      success: true,
      message: dataSend,
      showMessage: dataReplied,
      totalLength: totalLength
    };
  },
  saveMessage: async ctx => {
    let request = ctx.request;
    let Info = request.body["info"];
    let newMsh = new Comment(Info);
    await newMsh.save(err => {
      if (err) throw err;
      else {
        console.log("保存成功");
        ctx.body = {
          success: true,
          message: "保存成功"
        };
      }
    });
    ctx.body = {
      success: true,
      message: "保存成功"
    };
  },
  updateMessage: async ctx => {
    let request = ctx.request;
    let Info = request.body["info"];
    await Comment.findById(Info._id, (err, res) => {
      if (err) throw err;
      else {
        let obj = {
          isreplied: true,
          replycontent: Info["replycontent"],
          replytime: Info["replytime"]
        };
        Comment.updateOne({ _id: Info._id }, obj, err => {
          if (err) throw err;
          else console.log("更新" + Info._id + "成功");
        });
      }
    });
    ctx.body = {
      success: true,
      message: "更新成功"
    };
  },
  deleteMessage: async ctx => {
    let request = ctx.request;
    let Id = request.body["id"];
    await Comment.deleteOne({ _id: Id }, (err, res) => {
      if (err) throw err;
    });
    ctx.body = {
      success: true,
      message: "更新成功"
    };
  }
};
