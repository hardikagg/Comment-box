const router = require("express").Router();
const connection = require("../config/DBconnection");
const db = require("../config/makeDB");
const shortid = require('shortid');


// router.get("/",(req, res) => {
//     var t = "All Articles";
//     var sql =
//       "select A.Id as Id, A.Type as Type, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted'  GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head;";
//     connection.query(sql, (err, results, fields) => {
//       if (err) {
//         res.render("404");
//         return console.error(err.message);
//       }
//       ar = results;

//       if (req.user) {
//         res.render("homearticle", {
//           posts: ar,
//           head: "All Articles",
//           photo: req.user.Photo,
//           user: req.user,
//         });
//       } else {
//         res.render("homearticle", {
//           posts: ar,
//           head: t,
//           photo: "#",
//           user: req.user,
//         });
//       }
//     });
//   });
router.get("/", (req, res) => {
  try {
    var t = "All Articles";
    const limit = 10;
    const page = +req.query.page || 1;
    const offset = (page - 1) * limit;
    let totalArticles = 0;

    var sql = "select count(*) as count from `AllArticles` where Status='ACCEPTED';"
    connection.query(sql, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      totalArticles = results[0].count;
      // console.log(totalArticles);
    });


    var sql =
      "select A.Id as Id, A.Type as Type, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted'  GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head limit " + limit + " OFFSET " + offset + ";";
    connection.query(sql, (err, results, fields) => {
      if (err) {
        res.render("404");
        return console.error(err.message);
      }
      ar = results;

      if (req.user) {
        res.render("homearticle", {
          posts: ar,
          head: t,
          photo: req.user.Photo,
          user: req.user,
          currentPage: page,
          hasNextPage: limit * page < totalArticles,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalArticles / limit),
          tag:0
        });
      } else {
        res.render("homearticle", {
          posts: ar,
          head: t,
          photo: "#",
          user: req.user,
          currentPage: page,
          hasNextPage: limit * page < totalArticles,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalArticles / limit),
          tag:0
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/", (req, res) => {
  try {
    const limit = 10;
    const page = +req.query.page || 1;
    const offset = (page - 1) * limit;
    let totalArticles = 1;
    var t = "All Articles";

    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    // var sql="select count(*) as count From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted' and A.Head='" +
    // obj.search +
    // "'GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head;"
    // connection.query(sql, (err, results, fields) => {
    //   if (err) {
    //     return console.error(err.message);
    //   }                                                                                                                                                                                        'SELECT Head from AllArticles where Status="ACCEPTED" and Head like "%' + req.query.key + '%"'
    //   totalArticles=results[0].count; 
    //   // console.log(totalArticles);
    // });
    var sql =
      "select A.Id as Id,A.Type as Type, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted' and A.Head like '%" +
      obj.search +
      "%'GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head;";
    connection.query(sql, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      ar = results;
      //console.log(ar);

      if (req.user) {
        res.render("homearticle", {
          posts: ar,
          head: t,
          photo: req.user.Photo,
          user: req.user,
          currentPage: page,
          hasNextPage: limit * page < totalArticles,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalArticles / limit),
          tag:0
        });
      } else {
        res.render("homearticle", {
          posts: ar,
          head: t,
          photo: "#",
          user: req.user,
          currentPage: page,
          hasNextPage: limit * page < totalArticles,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalArticles / limit),
          tag:0
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// router.get("/type/:type", (req, res) => {
//   var t = req.params.type;
//   var sql =
//     "select A.Id as Id,A.Type as Type, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted' and A.Type='" +
//     req.params.type +
//     "'GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head;";
//   connection.query(sql, (err, results, fields) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     ar = results;
//     console.log(ar);

//     console.log(t);

//     if (req.user) {
//       res.render("homearticle", {
//         posts: ar,
//         head: t,
//         photo: req.user.Photo,
//         user: req.user,
//       });
//     } else {
//       res.render("homearticle", {
//         posts: ar,
//         head: t,
//         photo: "#",
//         user: req.user,
//       });
//     }
//   });
// });

router.get("/tag/:title", (req, res) => {
  try {
    const limit = 10;
    const page = +req.query.page || 1;
    const offset = (page - 1) * limit;
    let totalArticles = 0;

    var sql = "select count(*) as count from (select A.Id as Id, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog From Tags T Left Join  ItemTags I on T.TagId=I.TagId Left Join AllArticles A on I.ArticleId = A.Id where T.Title ='" +
      req.params.title +
      "' and A.Status='Accepted'  group by A.Id,A.Lang,A.Level,A.Blog,A.Head ) AA left join (select A.Id as Id, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted'  GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head) as BB on AA.Id = BB.Id;";
    connection.query(sql, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      totalArticles = results[0].count;
      // console.log(totalArticles);
    });
    var sql =
      "select * from (select A.Id as Id, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog From Tags T Left Join  ItemTags I on T.TagId=I.TagId Left Join AllArticles A on I.ArticleId = A.Id where T.Title ='" +
      req.params.title +
      "' and A.Status='Accepted'  group by A.Id,A.Lang,A.Level,A.Blog,A.Head ) AA left join (select A.Id as Id, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted'  GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head) as BB on AA.Id = BB.Id limit " + limit + " OFFSET " + offset + ";";
    connection.query(sql, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      //console.log(results);
      if (req.user) {
        res.render("homearticle", {
          posts: results,
          head: "All Articles",
          photo: req.user.Photo,
          user: req.user,
          currentPage: page,
          hasNextPage: limit * page < totalArticles,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalArticles / limit),
          tag: 1,
          title: req.params.title
        });
      } else {
        res.render("homearticle", {
          posts: results,
          head: "All Articles",
          photo: "#",
          user: req.user,
          currentPage: page,
          hasNextPage: limit * page < totalArticles,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalArticles / limit),
          tag:1,
          title: req.params.title
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// router.get("/Level/:level", (req, res) => {
//   var sql =
//     "select A.Id as Id,A.Type as Type, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted' and A.Level='" +
//     req.params.level +
//     "'GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head;";
//   connection.query(sql, (err, results, fields) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     ar = results;
//     console.log(ar);

//     res.render("homearticle", {
//       posts: ar,
//       head: "All Articles",
//       photo: req.user.Photo,
//       user: req.user,
//     });
//   });
// });
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

router.get("/:head-:postId", (req, res) => {
  try {
    let moreArt = [];
    let Art = [];
    let Comments;
    let Replies;
    var show=0;
    var totalUp;
    var totalDown;
    var thisVote;
    async function Render() {
      try {
        const r = await db.query(
          "select A.Id as Id, A.Type as Type, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog,A.PuzzleSolution as Solution,U.UserName as User, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId Left join Users U on A.UserId=U.ID where A.Status = 'Accepted' and A.Id='" +
          req.params.postId +
          "' GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head"
        );
        Art = r;
        // var comments=await db.query("select Text, UserName, UserId, CommentID from Comments where ArticleId='"+req.params.postId+"' and Reply='FALSE' ORDER BY Time DESC");
        var comments=await db.query("select  C.Text as Text, C.UserName as UserName, C.UserId as UserId, C.CommentID as CommentID, U.Photo as Photo From Comments C Left Join Users U on C.UserId = U.ID  where C.ArticleId='"+req.params.postId+"' and C.Reply='FALSE' ORDER BY Time DESC");
        var replies=await db.query("select  C.Text as Text, C.UserName as UserName, C.UserId as UserId, C.CommentID as CommentID, C.ReplyId as ReplyId, U.Photo as Photo From Comments C Left Join Users U on C.UserId = U.ID  where C.ArticleId='"+req.params.postId+"' and C.Reply='TRUE' ORDER BY Time DESC");
        
        
        Comments=comments;
        Replies=replies;
        
        var upvotes=await db.query("select count(*) from Votes where ArticleId='"+req.params.postId+"' and Vote='UPVOTE'");
        var downvotes=await db.query("select count(*) from Votes where ArticleId='"+req.params.postId+"' and Vote='DOWNVOTE'");
        
        var up=upvotes[0];
        var down=downvotes[0];
        
        totalUp=up['count(*)'];
        totalDown=down['count(*)'];
        
          
        if(req.user){
          var vote=await db.query("select Vote from Votes where ArticleId='"+req.params.postId+"' and UserId='"+req.user.ID+"'");
          if(vote.length!==0){
            var whichVote=vote[0];
            thisVote=whichVote["Vote"];
          }else{
            thisVote="NOT VOTED";
          }
        }else{
          thisVote="NO USER";
        }
        

        // console.log(JSON.stringify(Comments[0]));
        //console.log(Art);
        if(Art[0].Title){
          let t = Art[0].Title.split(",");

        //console.log(t);

        await Promise.all(
          t.map(async (ele) => {
            var MoreArtForTitle = await db.query(
              "select * from (select A.Id as Id, A.Lang as Lang,A.Level as Level , A.Head as Head, A.Blog as Blog From Tags T Left Join  ItemTags I on T.TagId=I.TagId Left Join AllArticles A on I.ArticleId = A.Id where T.Title ='" + ele + "' and A.Status='Accepted'  group by A.Id,A.Lang,A.Level,A.Blog,A.Head ) AA left join (select A.Id as Id, GROUP_CONCAT(T.Title) as Title From AllArticles A Left Join ItemTags I on A.Id = I.ArticleId Left Join Tags T On T.TagId = I.TagId where A.Status = 'Accepted'   GROUP BY A.Id,A.Lang,A.Level,A.Blog,A.Head) as BB on AA.Id = BB.Id;"
            );
            // console.log(MoreArtForTitle);
            await asyncForEach(MoreArtForTitle, async (n) => {
              moreArt.push(n);
            })
            // moreArt = [...MoreArtForTitle];
            //  console.log(moreArt);
          })
        );
          //console.log(moreArt);
        show=1;
        return moreArt;
        }
        else{
          show=0;
          return moreArt;
        }
        
      } catch (err) {
        console.log(err);
      }
    }
    Render().then((result) => {
      // console.log("===============")
      // console.log(Art);
      //console.log(result);
      if (result.length !== 0){
        result = result.filter((r) => r.Id !== Art[0].Id);}
      //console.log(result);
      
        
       
//console.log(req.user);

//console.log(Comments);
      if (req.user) {
        res.render("homePost", {
          posts: Art,
          head: "All Articles",
          photo: req.user.Photo,
          user: req.user,
          MoreArticles: result,
          show:show,
          comments: Comments,
          replies: Replies,
          displayname: req.user.UserName||req.user.DisplayName,
          userId: req.user.ID,
          totalUpVotes:totalUp,
          totalDownVotes:totalDown,
          vote: thisVote

        });
      } else {
        res.render("homePost", {
          posts: Art,
          head: "All Articles",
          photo: "#",
          user: req.user,
          MoreArticles: result,
          show:show,
          comments: Comments,
          replies: Replies,
          displayname: '#',
          userId: '#',
          totalUpVotes:totalUp,
          totalDownVotes:totalDown,
          vote: thisVote
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});



router.post("/comments", (req, res) => {
  var text=req.body.text;
  var username=req.body.username;
  var head=req.body.head;
  var postId=req.body.postId;
  var userId=req.body.UserId;
  var id=shortid.generate();
  var date=new Date();
  date=date.getTime();
  var sql="INSERT into Comments (ArticleId, Text, CommentID, UserName, UserId, Time, Reply) values ('"+postId+"','"+text+"', '"+id+"','"+username+"','"+userId+"','"+date+"', 'FALSE')";
  connection.query(sql, (err, results, fields)=>{
    if (err) throw err;
    res.redirect("/home/"+head+"-"+postId+"#comments");
  })

  //console.log(username);
 
})

router.post("/replies", (req, res)=>{
  var text=req.body.text;
  var username=req.body.username;
  var head=req.body.head;
  var postId=req.body.postId;
  var userId=req.body.UserId;
  var replyId=req.body.ReplyId;
  var id=shortid.generate();
  var date=new Date();
  date=date.getTime();
  var sql="INSERT into Comments (ArticleId, Text, CommentID, UserName, UserId, Time, Reply, ReplyId) values ('"+postId+"','"+text+"', '"+id+"','"+username+"','"+userId+"','"+date+"', 'TRUE','"+replyId+"')";
  connection.query(sql, (err, results, fields)=>{
    if (err) throw err;
    res.redirect("/home/"+head+"-"+postId+"#"+replyId);
  })
})


router.post("/deletecomment/:commentId", async function (req, res){
  var commentid=req.params.commentId; 
  // var head=req.body.head;
  //   var postId=req.body.postId;
  var sql="DELETE from Comments where CommentID='"+commentid+"'";
  var resultReply=await db.query("DELETE from Comments where ReplyId='"+commentid+"'");
  connection.query(sql, (err, results, fields)=>{
    if(err) throw err;
    //console.log(results);
    res.status(200).json({message: "Deleted"});
  })
})

router.post("/upvote/:postId/:userId", async function (req, res){
  var postId=req.params.postId;
  var userId=req.params.userId;
  var results=await db.query("SELECT UserId, ArticleId from Votes where ArticleId='"+postId+"' and UserId='"+userId+"' and Vote='DOWNVOTE'");
  var results2=await db.query("SELECT UserId, ArticleId from Votes where ArticleId='"+postId+"' and UserId='"+userId+"' and Vote='UPVOTE'");
  if(results.length===0&&results2.length===0)
  {
    var insert=await db.query("INSERT into Votes (ArticleId, UserId, Vote) values ('"+postId+"','"+userId+"','UPVOTE')");
    res.status(200).json({message: "Inserted"});
  }else if(results.length===0&&results2.length!==0){
    var del=await db.query("DELETE from Votes where ArticleId='"+postId+"' and UserId='"+userId+"' and Vote='UPVOTE'");
    res.status(200).json({message: "Deleted"});
  }else{
    var update=await db.query("UPDATE Votes set Vote='UPVOTE' where ArticleId='"+postId+"' and UserId='"+userId+"'");
    res.status(200).json({message: "Updated"});
  }

})

router.post("/downvote/:postId/:userId", async function (req, res){
  var postId=req.params.postId;
  var userId=req.params.userId;
  var results=await db.query("SELECT UserId, ArticleId from Votes where ArticleId='"+postId+"' and UserId='"+userId+"' and Vote='DOWNVOTE'");
  var results2=await db.query("SELECT UserId, ArticleId from Votes where ArticleId='"+postId+"' and UserId='"+userId+"' and Vote='UPVOTE'");
  if(results.length===0&&results2.length===0)
  {
    var insert=await db.query("INSERT into Votes (ArticleId, UserId, Vote) values ('"+postId+"','"+userId+"','DOWNVOTE')");
    res.status(200).json({message: "Inserted"});
  }else if(results.length!==0&&results2.length===0){
    var del=await db.query("DELETE from Votes where ArticleId='"+postId+"' and UserId='"+userId+"' and Vote='DOWNVOTE'");
    res.status(200).json({message: "Deleted"});
  }else{
    var update=await db.query("UPDATE Votes set Vote='DOWNVOTE' where ArticleId='"+postId+"' and UserId='"+userId+"'");
    res.status(200).json({message: "Updated"});
  }

})





router.get('/search', function (req, res) {
  try {
    connection.query('SELECT Head from AllArticles where Status="ACCEPTED" and Head like "%' + req.query.key + '%"', function (err, rows, fields) {
      if (err) throw err;
      var data = [];
      for (i = 0; i < rows.length; i++) {
        data.push(rows[i].Head);
      }
      res.end(JSON.stringify(data));
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
