const SendButton = document.querySelector("#button");
const ChatList = document.querySelector("#chat-msg");

// openAI API
const url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 사용자의 기분에 맞추어 노래를 추천해주는 도우미입니다."
  }
];
// 인삿말과 질문자의 기분이 어떤지 선택
  function Greeting() {
    return new Promise(resolve => {

      printMsg('안녕하세요! 오늘 기분은 어떤가요?')
      const feelbtnspace = document.createElement('span');
      feelbtnspace.className = 'msg'
      ChatList.prepend(feelbtnspace);
    
      const feelSadbutton = document.createElement('button');
      feelSadbutton.className = 'btn feelsad';
      
      const feelSosobutton = document.createElement('button');
      feelSosobutton.className = 'btn feelsoso';
      
      const feelGoodbutton = document.createElement('button');
      feelGoodbutton.className = 'btn feelgood';
      
      feelSadbutton.textContent = "별로 안 좋아요..."
      feelSosobutton.textContent = "그저 그래요"
      feelGoodbutton.textContent = "좋아요!"
      
      feelbtnspace.prepend(feelSadbutton);
      feelbtnspace.prepend(feelSosobutton);
      feelbtnspace.prepend(feelGoodbutton);
    
      feelbtnspace.addEventListener('click', (event) => {
        feelbtnspace.remove('btn');
        
        if (event.target.className === 'btn feelsad'){
          printMsg('이런! 안 좋은 일이라도 있었나요? 잘 해결되길 바랄게요.')
          localStorage.setItem("feel","슬플 때");
        }
        if (event.target.className === 'btn feelsoso'){
          printMsg('그렇군요...')
          localStorage.setItem("feel","그저 그럴 때");
        }
        if (event.target.className === 'btn feelgood'){
          printMsg('오, 좋은 일이 있었나요? 축하드려요!')
          localStorage.setItem("feel","기분 좋을 때");
        }
        resolve();
        
      })
    });


}

// 듣고 싶은 노래 분위기 선택
  function SelectFeeling(){
    return new Promise(resolve =>{
      printMsg('그럼, 어떤 분위기의 노래를 듣고 싶으세요?')
      const songbtnspace = document.createElement('span');
      songbtnspace.className = 'msg'
      ChatList.prepend(songbtnspace);
    
      const songSadbutton = document.createElement('button');
      songSadbutton.className = 'btn songSad';
      
      const songCalmbutton = document.createElement('button');
      songCalmbutton.className = 'btn songCalm';
      
      const songExcitingbutton = document.createElement('button');
      songExcitingbutton.className = 'btn songExciting';
      
      const songPitapatbutton = document.createElement('button');
      songPitapatbutton.className = 'btn songPitapat';
      
      songSadbutton.textContent = "슬픈"
      songCalmbutton.textContent = "잔잔한"
      songExcitingbutton.textContent = "신나는"
      songPitapatbutton.textContent = "설레는"
      
      songbtnspace.prepend(songSadbutton);
      songbtnspace.prepend(songCalmbutton);
      songbtnspace.prepend(songExcitingbutton);
      songbtnspace.prepend(songPitapatbutton);

      songbtnspace.addEventListener('click', (event) => {
        songbtnspace.remove('btn');
        
        if (event.target.className === 'btn songSad'){
          localStorage.setItem("song","슬픈 노래");
        }
        if (event.target.className === 'btn songCalm'){
          localStorage.setItem("song","잔잔한 노래");
        }
        if (event.target.className === 'btn songExciting'){
          localStorage.setItem("song","신나는 노래");
        }
        if (event.target.className === 'btn songPitapat'){
          localStorage.setItem("song","설레는 노래");
        }
        printMsg('잠시만 기다려 주세요')
        resolve();
      
      })
    })
  }


// 메세지 프린팅 함수
function printMsg(message){
  const Msg = document.createElement('div');
  Msg.className = 'msg';
  Msg.textContent = message;
  ChatList.prepend(Msg);
  
}
//GPT에게 로컬스토리지에 저장해둔 값으로 요청하기
function requestToCHATGPT(){
  return new Promise(resolve => {

    const contentFeel = localStorage.getItem("feel");
    const contentSong = localStorage.getItem("song");
    // console.log(contentFeel);
    // console.log(contentSong);
    data.push({
      "role":"user",
      "content": "기분이 "+contentFeel+" 듣기좋은 "+contentSong+" 한국노래 추천해줘"
  
    })
    localStorage.clear;
    resolve();
  })



}
function chatGPTAPI() {
  return new Promise(resolve =>{
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        redirect: 'follow'
    })
    .then(res => res.json())
    .then(res => {
  
        // 답변 온 것을 출력
        printMsg(res.choices[0].message.content)
        resolve();
        moreSelect();
    })
  })
}
function moreSelect(){
  return new Promise(resolve => {

    const selectbtnspace = document.createElement('span');
    selectbtnspace.className = 'msg'
    ChatList.prepend(selectbtnspace);
    const morebutton = document.createElement('button');
    const restartbutton = document.createElement('button');
    const endbutton = document.createElement('button');
    morebutton.className = 'btn more';
    restartbutton.className = 'btn restart';
    endbutton.className = 'btn end';
  
    morebutton.textContent = "더 추천받기"
    restartbutton.textContent = "다시 선택하기"
    endbutton.textContent = "끝내기"
  
    selectbtnspace.prepend(morebutton);
    selectbtnspace.prepend(restartbutton);
    selectbtnspace.prepend(endbutton);

    selectbtnspace.addEventListener('click', (event) => {
      selectbtnspace.remove('btn');
      
      if (event.target.className === 'btn more'){
        printMsg('잠시만 기다려 주세요')
        return chatGPTAPI();
      }
      if (event.target.className === 'btn restart'){
        ChatList.clear;
        return main();
        
      }
      if (event.target.className === 'btn end'){
        printMsg('사용해주셔서 감사합니다!')
        return;
        
      }
      resolve();
      
    })
  })
  

}


let main = async function(){
  await Greeting();
  await SelectFeeling();
  await requestToCHATGPT();
  await chatGPTAPI();
  
}


main();