let i,j,playlist,track;

let  wr=document.createElement('div');
wr.className='wrapper';
document.getElementById('wr').appendChild(wr);

for(i=1;i<=10;i++){

    //create a new playlist card
    playlist=document.createElement('div');
    playlist.className="card";
    wr.appendChild(playlist);

    //image
    imageUrl=document.createElement('img');
    imageUrl.src="https://s1.thcdn.com/productimg/1600/1600/11489653-1374492597223451.jpg";
    playlist.appendChild(imageUrl);

    //info
    info=document.createElement('div');
    info.className='info';
    playlist.appendChild(info);

    infoTitle=document.createElement('h1');
    infoTitleText=document.createTextNode('information h1');
    infoTitle.appendChild(infoTitleText);
    info.appendChild(infoTitle);

    paragraph=document.createElement('p');
    paragraphText=document.createTextNode('information paragraph will be written here');
    paragraph.appendChild(paragraphText);
    info.appendChild(paragraph);

    button=document.createElement('button');
    buttonText=document.createTextNode('click me');
    button.appendChild(buttonText);
    //button.onclick=alert('you know how to push my buttons');
    info.appendChild(button);


    // playlist=document.createElement('ul');
    // pinfo=document.createTextNode(i);
    // playlist.id=i;
    // playlist.appendChild(pinfo);
    // document.getElementById('lists').appendChild(playlist);

   

    

    // for(j=4;j<=9;j++){
    //     track=document.createElement('li');
    //     tinfo=document.createTextNode(j);
    //     track.id=j;
    //     track.appendChild(tinfo);
    //     document.getElementById(i).appendChild(track);
    // }
}

// for(i=1;i<=3;i++){

//     playlist=document.createElement('ul');
//     pinfo=document.createTextNode(i);
//     playlist.id=i;
//     playlist.appendChild(pinfo);
//     document.getElementById('lists').appendChild(playlist);

   

    

//     for(j=4;j<=9;j++){
//         track=document.createElement('li');
//         tinfo=document.createTextNode(j);
//         track.id=j;
//         track.appendChild(tinfo);
//         document.getElementById(i).appendChild(track);
//     }
// }