const List = require("../models/List");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllLists = async (req, res) => {
  const lists = await List.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ lists, count: lists.length });
};

const getList = async (req, res) => {
  const {
    user: { userId },
    params: { id: listId },
  } = req;
  const list = await List.findOne({ _id: listId, createdBy: userId });
  if (!list) {
    throw new NotFoundError(`No listing with id ${listId}`);
  }
  res.status(StatusCodes.OK).json({ list });
};

const createList = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const list = await List.create(req.body);
  res.status(StatusCodes.CREATED).json({ list });
};

const updateList = async (req, res) => {
  const {
    body: { needList },
    user: { userId },
    params: { id: listId },
  } = req;
  if (needList === "") {
    throw new BadRequestError("Field cannot be empty");
  }
  const list = await List.findByIdAndUpdate(
    { _id: listId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!list) {
    throw new NotFoundError(`No listing with id ${listId}`);
  }
  res.status(StatusCodes.OK).json({ list });
};

const deleteList = async (req, res) => {
  const {
    body: { needList },
    user: { userId },
    params: { id: listId },
  } = req;
  const list = await List.findOneAndRemove({
    _id: listId,
    createdBy: userId,
  });
  if (!list) {
    throw new NotFoundError(`No listing with id ${listId}`);
  }
  res.status(StatusCodes.OK);
};

module.exports = {
  getAllLists,
  getList,
  createList,
  updateList,
  deleteList,
};
