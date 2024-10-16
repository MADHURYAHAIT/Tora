import { Account, Avatars, Client,Databases,ID ,Query,Storage} from 'react-native-appwrite';
export const appwriteConfig={
    endpoint:'https://cloud.appwrite.io/v1',
    platform:'com.madhurya.tora',
    projectId:'665827560022ceab82bb',
    databaseId:'665829f900038af19ce4',
    userCollectionId:'66582a28000045cf0d55',
    videoCollectionId:'66582a4b0003b751cab4',
    storageId:'66582c3b000d183584a5',
    bookmark:'66f65d89002ea4ad4a20'
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
  bookmark,
} =appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage =new Storage(client);

//create user
export  const createUser= async (email, password, username,age)=>{
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username,
        age
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
          age:age,
        }
      );
  
      return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
  }

//signin
  export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }
  
//get current user
export const  getCurrentUser=async()=> {
    try {
      const currentAccount = await account.get();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error); 
      return null;
    }
  }
  
  
// Get All Posts
export const getAllPosts = async (userId) => {
  try {
    // Query to list documents from the videos collection
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.videoCollectionId, 
      [Query.orderDesc('$createdAt')]
    );

    // Extract video IDs from the response documents
    const videoIds = response.documents.map((video) => video.$id);

    // Fetch the bookmark state for each video
    const bookmarks = await getBookmarks(userId);
    const bookmarkedVideoIds = bookmarks.map((bookmark) => bookmark.videos.$id);

    // Update the bookmark state for each video
    response.documents.forEach((video) => {
      video.isBookmarked = bookmarkedVideoIds.includes(video.$id);
    });
   // console.log(response.documents);
    // Return the list of video documents with bookmark state
    return response.documents;
  } catch (error) {
    console.log("Error getting all posts:", error.message);
    console.log("Error code:", error.code);
    console.log("Error response:", error.response);
    throw new Error(error); // Throw error to handle it properly in the calling function
  }
};

//Get Latest 

// Get Latest Posts
export const getLatestPosts = async (userId) => {
  try {
    // Query to list documents from the videos collection
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.videoCollectionId, 
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    );

    // Extract video IDs from the response documents
    const videoIds = response.documents.map((video) => video.$id);

    // Fetch the bookmark state for each video
    const bookmarks = await getBookmarks(userId);
    const bookmarkedVideoIds = bookmarks.map((bookmark) => bookmark.videos.$id);

    // Update the bookmark state for each video
    response.documents.forEach((video) => {
      video.isBookmarked = bookmarkedVideoIds.includes(video.$id);
    });

    // Return the list of video documents with bookmark state
    return response.documents;
  } catch (error) {
    console.log("Error getting latest posts:", error.message);
    console.log("Error code:", error.code);
    console.log("Error response:", error.response);
    throw new Error(error); // Throw error to handle it properly in the calling function
  }
};
// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
      
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

//upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  // const asset = { type: mimeType, ...rest };
  const asset = { 
    name:file.fileName,
    type:file.mimeType,
    size:file.fileSize,
    uri:file.uri,
   };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );
    //appwrite gives a file url
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    //console.log("Appwrite",fileUrl);
    return (fileUrl);
  } catch (error) {
    throw new Error(error);
  }
}

//create vid
export const createVideo = async (form)=>{
  try{
    const [thumbnailUrl,videoUrl]=await Promise.all([
      uploadFile(form.thumbnail,'image'),
      uploadFile(form.video,'video'),
    ])

    const newPost =await databases.createDocument(
      databaseId,videoCollectionId,ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
    )
    return newPost
  }catch(error){
    throw new Error(error);
  }
}

//search
export const searchPosts = async(query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");
    console.log(posts.documents);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//user profile
export const  getUserProf = async (userId)=> {
  // console.log("bhalo basa",userId)
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId),Query.orderDesc('$createdAt')]
    );

    
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//signout
export const signOut=async() =>{
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}


//delete video 


export const deleteVideo = async (videoId) => {
  try {
    console.log('Deleting video with document ID:', videoId);

    // Get the video document from the videos collection
    const videoDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId
    );

    if (!videoDoc) {
      console.warn('Video document not found for ID:', videoId);
      return false;
    }

    // Extract the video link from the document data
    const videoLink = videoDoc['video']; // Assuming "videoLink" is the property name
    if (!videoLink) {
      console.warn('Video link not found in document:', videoDoc);
      return false; // Or handle the case where video link is missing
    }
    
   const thumbnailLink=videoDoc['thumbnail'];

    // Extract the video ID from the video link (logic depends on your URL structure)

    const videoIdFromLink = extractVideoIdFromUrl(videoLink); // Implement this function
    const thumbnailIdFromLink=extractVideoIdFromUrl(thumbnailLink);
    // Delete the video file using the extracted video ID
    await storage.deleteFile(appwriteConfig.storageId, videoIdFromLink);
    //Delete Thumbnail
    await storage.deleteFile(appwriteConfig.storageId, thumbnailIdFromLink);

    // Delete the video document from the videos collection
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId
    );

    console.log("delete")
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error(error); // Or handle the error gracefully
  }
};

// Function to extract video ID from URL (implement based on your URL structure)
function extractVideoIdFromUrl(uploadedFileUrl) {
  const url = new URL(uploadedFileUrl);
  const filePath = url.pathname.split('/');
  const fileId = filePath[filePath.length - 2]; 
 
  return fileId // Assuming last part is the video ID
}




// Update username
export const updateUsername = async (newUsername) => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.documents[0].$id,
      {
        username: newUsername,
      }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};




// Update avatar
export const updateAvatar = async (newAvatar) => {
  // console.log('upload avtar function called');
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    
    // console.log('upload successji',newAvatar)

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.documents[0].$id,
      {
        avatar: newAvatar,
      }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};



// Add Bookmark
export const addBookmark = async (userId, videoId) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookmark,
      ID.unique(),
      {
        users: userId,
        videos: videoId, // Set the videos field to the actual video ID
      }
    );
    //console.log("vide",videoId);
    return response;
  } catch (error) {
    console.log("Error adding bookmark:", error.message);
    console.log("Error code:", error.code);
    console.log("Error response:", error.response);
    throw new Error(error);
  }
};



// Remove Bookmark
export const removeBookmark = async (userId, videoId) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmark,
      [Query.equal("users", userId), Query.equal("videos", videoId)]
    );

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bookmark,
        response.documents[0].$id
      );
    }

    return true;
  } catch (error) {
    console.log("Error removing bookmark:", error.message);
    console.log("Error code:", error.code);
    console.log("Error response:", error.response);
    throw new Error(error);
  }
};



// Get Bookmarked Videos
export const getBookmarkedVideos = async (userId) => {
  try {
    // Query to list documents from the bookmark collection for the user
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.bookmark, 
      [Query.equal("users", userId["equals"])] // Ensure userId matches the stored type
    );

    // Extract bookmarked video IDs from the response documents
    const bookmarkedVideoIds = response.documents.map((bookmark) => bookmark.videos.$id);

    // Fetch the actual video documents
    const bookmarkedVideos = await Promise.all(bookmarkedVideoIds.map(async (videoId) => {
      const videoResponse = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        videoId
      );
      return videoResponse;
    }));

    // Return the list of bookmarked video documents
    return bookmarkedVideos;
  } catch (error) {
    console.log("Error getting bookmarked videos:", error.message);
    console.log("Error code:", error.code);
    console.log("Error response:", error.response);
    throw new Error(error); // Throw error to handle it properly in the calling function
  }
};

// Get Bookmarks
export const getBookmarks = async (userId) => {
  try {
    // Query to list documents from the bookmark collection for the user
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.bookmark, 
      [Query.equal("users", userId)]
    );

    // Extract bookmarked video IDs from the response documents
    const bookmarks = response.documents;

    // Return the list of bookmarked video documents
    return bookmarks;
  } catch (error) {
    console.log("Error getting bookmarks:", error.message);
    console.log("Error code:", error.code);
    console.log("Error response:", error.response);
    throw new Error(error); // Throw error to handle it properly in the calling function
  }
};