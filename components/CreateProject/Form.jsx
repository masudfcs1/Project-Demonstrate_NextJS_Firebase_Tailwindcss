import Data from "@/Data";
import React, { useEffect, useState } from "react";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import app from "./../../Shared/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Loader from "../Loader";
import { useRouter } from "next/router";

export default function Form() {
  const [inputs, setInputs] = useState({});
  const [techList, setTechList] = useState([]);
  const [file, setFile] = useState([]);
  const [loader, setLoader] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [docId, setDocId] = useState(Date.now().toString());

  const db = getFirestore(app);
  const router = useRouter();
  const storage = getStorage(app);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({
      ...values,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const storageRef = ref(storage, "show-projects/" + file?.name);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then((url) => {
          setInputs((values) => ({
            ...values,
            image: url
          }));
          setSubmit(true);
        });
      });
    // console.log(inputs);
    // await setDoc(doc(db, "Projects", Date.now().toString()), inputs);
  };

  useEffect(() => {
    if (submit == true) {
      saveDoc();
    }
  }, [submit]);

  const saveDoc = async () => {
    await setDoc(doc(db, "Projects", docId), inputs);
    setLoader(false);
    router.push("/profile");
  };

  const onTechSelect = (name, isChecked) => {
    if (isChecked) {
      setTechList((techList) => [...techList, name]);
    } else {
      let techListItem = techList.filter((item) => item !== name);
      setTechList(techListItem);
    }
  };

  useEffect(() => {
    setInputs((values) => ({
      ...values,
      ["techList"]: techList
    }));
    console.log(techList);
  }, [techList]);

  return (
    <div
      className="flex justify-center mt-10
  shadow-md mx-4 md:mx-56 lg:mx-72 p-5 rounded-md"
    >
      {loader ? (
        <div className="absolute">
          <Loader />
        </div>
      ) : null}
      {/* onSubmit={handleSubmit} */}
      <form onSubmit={handleSubmit}>
        <h2
          className="text-[30px]
    font-extrabold text-teal-500"
        >
          ADD PROJECT
        </h2>
        <h2 className="mb-6">Create New Project and Explore with Community</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          // onChange={(e) => console.log(e)}
          className="w-full mb-4 border-[1px] p-2 rounded-md"
        />
        <textarea
          name="desc"
          className="w-full mb-4 
      outline-teal-400 border-[1px] 
      p-2 rounded-md"
          required
          onChange={handleChange}
          placeholder="Write Description here"
        />
        <h2 className="mb-3 font-bold">Select Technology</h2>
        <div className="grid grid-cols-2 mb-4 md:grid-cols-3  ">
          {Data.Technology.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                id="technology"
                onClick={(e) => onTechSelect(item.name, e.target.checked)}
                type="checkbox"
                className="w-4 h-4"
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>
        <input
          type="text"
          name="app-demo-url"
          placeholder="App Demo Url"
          onChange={handleChange}
          className="w-full mb-4 border-[1px] p-2 rounded-md outline-teal-400"
        />
        <input
          type="text"
          name="ui-ux-design-url"
          onChange={handleChange}
          placeholder="UI/UX Design Url(Figma)"
          className="w-full mb-4 border-[1px] p-2 rounded-md outline-teal-400"
        />
        <input
          type="text"
          name="yt-url"
          onChange={handleChange}
          placeholder="Youtube Tutorial Url"
          className="w-full mb-4 border-[1px] p-2 rounded-md outline-teal-400"
        />
        <input
          type="text"
          name="github-url"
          onChange={handleChange}
          placeholder="Github Source Code Url"
          className="w-full mb-4 border-[1px] p-2 rounded-md outline-teal-400"
        />

        <input
          type="text"
          onChange={handleChange}
          name="instagram"
          placeholder="Instagram Profile"
          className="w-full mb-4 border-[1px] p-2 rounded-md outline-teal-400"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/gif, image/jpeg, image/png"
          className="mb-5 border-[1px] w-full outline-teal-400"
        />
        <button
          type="submit"
          className="bg-teal-500 w-full p-1 
rounded-md text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
