const socket = io("/");
const videoGrid = document.getElementById("video-grid");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3050"
});

const peers = {};
let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = false;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", call => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", userId => {
      connectToNewUser(userId, stream);
    });
    let text = $("input");
    // when press enter send message
    $("html").keydown(function(e) {
      
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit("message", text.val());
        text.val("");
      }
    });


    socket.on("createMessage", message => {
      
      $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
      scrollToBottom();
    })
  });
peer.on("open", id => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
const scrollToBottom = () => {
  let d = $(".mainchatWindows");
  d.scrollTop(d.prop("scrollHeight"));
};


///Mute the Video

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  }else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
  <i class="fas fa-solid fa-microphone"></i>
  <span>Mute</span>`
  document.querySelector(".main_mute_button").innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
  
  <i class="unmute fas fa-regular fa-microphone-slash"></i>
  <span>UnMute</span>`
  document.querySelector(".main_mute_button").innerHTML = html;
}



//Stop Video 

const playVideo = () => {

  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  }else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `
  <i class="fas fa-solid fa-video"></i>
  <span>Stop Video</span>
  `
  document.querySelector(".main_video_button").innerHTML = html;
}


const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-regular fa-video-slash"></i>
  <span>Play Video</span>
  `
  document.querySelector(".main_video_button").innerHTML = html;
}


