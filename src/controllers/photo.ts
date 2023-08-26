import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import appRoot from "app-root-path";
import { v4 as uuidv4 } from "uuid";

import { Photo } from "../models/photo";
import fs from "fs";

import { config } from "dotenv";
config();

const PATH_TO_UPLOADS = path.join(appRoot.toString(), "uploads");

export const getPhoto = async (req: Request, res: Response) => {
  // TODO: start a new thread while serving the photo the photo
  const publicId = req.params.id;

  // fetch the details from DB
  const photo = await Photo.findOne({ publicId: publicId });
  if (!photo) {
    return res.status(404).json({ msg: "No file found" });
  }

  if (photo.accessCount > 5) {
    return res
      .status(403)
      .json({ msg: "Requested more than limit of 5 times a day" });
  }

  // check if the file exists
  const userFile = path.join(PATH_TO_UPLOADS, photo.name);
  if (!fs.existsSync(userFile)) {
    return res.status(404).json({ msg: "No file found" });
  }
  // TODO update access count
  await Photo.findOneAndUpdate(
    { _id: photo._id },
    {
      $set: {
        accessCount: photo.accessCount + 1,
      },
    }
  );
  res.sendFile(userFile);
};

export const addPhoto = async (req: Request, res: Response) => {
  // check if the file was sent or not
  if (!req.files) {
    return res.status(403).json({ msg: "No file was uploaded" });
  }

  // TODO: start a new thread while saving the photo'

  // Check size: Needs to be <5MB if not the limit handler middleware is called
  // Check type: Needs to be of the type png, jpeg or jpg
  const file = req.files.fileUpload as UploadedFile;
  if (!file) {
    return res.status(403).json({ msg: "No file was uploaded" });
  }

  const allowedExtensions = [".png", ".jpeg", ".jpg"];

  const uploadFileExtension = path.extname(file.name);
  if (!allowedExtensions.includes(uploadFileExtension)) {
    return res
      .json({ msg: `File of extension ${uploadFileExtension} is not allowed` })
      .status(403);
  }

  const publicId = uuidv4();
  const savedFileName = publicId + uploadFileExtension;

  const newPhoto = new Photo({
    originalName: file.name,
    publicId: publicId,
    name: savedFileName,
  });
  await newPhoto.save();

  // save the file to uploads folder
  file.mv(`${PATH_TO_UPLOADS}/${savedFileName}`, (err) => {
    if (err) {
      console.log(err);
      return res
        .send({ msg: `File couldn't be uploaded, try again after sometime` })
        .status(500);
    }

    // save the fileName to the DB & return the ID / constructed URL
    const ret = {
      url: `${process.env.BASE_URL}/photos/${publicId}`,
      msg: `Successfully saved your photo in the cloud`,
    };
    return res.status(201).json(ret);
  });
};
