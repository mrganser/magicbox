const ChannelsController = function () { };

ChannelsController.prototype.findAll = async function (db) {
  const collection = db.collection('sharedlinks');
  return collection.distinct('channel', { secret: false });
};

module.exports = new ChannelsController();
