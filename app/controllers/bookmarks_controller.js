// Generated by CoffeeScript 1.6.2
before(function() {
  var _this = this;

  return Bookmark.find(req.params.id, function(err, bookmark) {
    if (err || !bookmark) {
      return send({
        error: true,
        msg: "Bookmark not found"
      }, 404);
    } else {
      _this.bookmark = bookmark;
      return next();
    }
  });
}, {
  only: ['destroy']
});

action('all', function() {
  return Bookmark.all(function(err, bookmarks) {
    if (err) {
      compound.logger.write(err);
      return send({
        error: true,
        msg: "Server error occured while retrieving data."
      }, 500);
    } else {
      return send(bookmarks, 200);
    }
  });
});

action('create', function() {
  var _this = this;

  return Bookmark.create(req.body, function(err, bookmark) {
    if (err) {
      compound.logger.write(err);
      return send({
        error: true,
        msg: "Server error while creating bookmark."
      }, 500);
    } else {
      return send(bookmark, 200);
    }
  });
});

action('destroy', function() {
  return this.bookmark.destroy(function(err) {
    if (err) {
      compound.logger.write(err);
      return send({
        error: 'Cannot destroy bookmark'
      }, 500);
    } else {
      return send({
        success: 'Bookmark succesfuly deleted'
      }, 200);
    }
  });
});