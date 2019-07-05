const CLIENT_ID = '297380c742a34234b7ce782545c5f44c';
const REDIRECT_URI = 'http://localhost:8080';

const SPOTIFY_API_ROOT = 'https://api.spotify.com/v1';
const SPOTIFY_PLAYLISTS_URL = '/me/playlists';
const SPOTIFY_PLAYLIST_TRACKS_URL = '/playlists/id/tracks';

const parseParams = paramsString => {
    let hash = paramsString;
    if (hash[0] == '#') {
        hash = hash.substring(1, hash.length);
    }

    const params = hash.split('&');
    return params.reduce((dict, param) => {
        const [key, value] = param.split('=');
        dict[key] = value;
        return dict;
    }, {});
};


const authorizeUrl = (clientId, redirectUri) =>
    `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-read-private`;

const getPlaylists = accessToken =>
    fetch(SPOTIFY_API_ROOT + SPOTIFY_PLAYLISTS_URL, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
        node: 'cors',
        method: 'GET',
    }).then(response => response.json());

const getPlaylistTracks = (accessToken, playlistId) =>
    fetch(SPOTIFY_API_ROOT + SPOTIFY_PLAYLIST_TRACKS_URL.replace(/id/, playlistId), {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
        node: 'cors',
        method: 'GET',
    }).then(response => response.json());

//------------FIRST---VERSION-------------------------------------------------------------------
// let wra = document.createElement('div');
// wra.className = 'wrapper';
// document.getElementById('wr').appendChild(wra);

// const params = parseParams(window.location.hash);
// if (!params.access_token) {
//     window.location.href = authorizeUrl(CLIENT_ID, REDIRECT_URI);
// } else {
//     getPlaylists(params.access_token).then(response => {
//         response.items.forEach(playlist => {
//             //console.log('Playlist: ' + playlist.name);
//             //console.log('Playlist id is:' + playlist.id);
//             //console.log('Playlist', playlist);
//             getPlaylistTracks(params.access_token, playlist.id).then(
//                 response => {
//                     //console.log('Playlist name:', playlist.name);
//                     wr = document.createElement("ul");
//                     wra.appendChild(wr);

//                     response.items.forEach(item => {
//                         //create a new playlist card
//                         divPlaylist = document.createElement('div');
//                         divPlaylist.className = "card";
//                         wr.appendChild(divPlaylist);

//                         //image
//                         imageUrl = document.createElement('img');
//                         imageUrl.src = item.track.album.images[1].url;
//                         divPlaylist.appendChild(imageUrl);

//                         //info
//                         info = document.createElement('div');
//                         info.className = 'info';
//                         divPlaylist.appendChild(info);

//                         paragraph = document.createElement('h6');
//                         paragraphText = document.createTextNode(playlist.name + ' playlist');
//                         paragraph.appendChild(paragraphText);
//                         info.appendChild(paragraph);

//                         infoTitle = document.createElement('h1');
//                         infoTitleText = document.createTextNode(item.track.artists[0].name);
//                         infoTitle.appendChild(infoTitleText);
//                         info.appendChild(infoTitle);

//                         paragraph = document.createElement('h3');
//                         paragraphText = document.createTextNode(item.track.name);
//                         paragraph.appendChild(paragraphText);
//                         info.appendChild(paragraph);
//                     });
//                 }
//             )
//         })
//     })
// }
//--------------------------------------END--OF--FIRST--VERSION----------------------------------------

class MyTrack {
    constructor() {
        this.name = '';
        this.artist = '';
        this.image = '';
    }

    setName(name) {
        this.name = name;
    }
    setArtist(artist) {
        this.artist = artist;
    }
    setImage(image) {
        this.image = image;
    }
    getName() {
        return this.name;
    }
    getArtist() {
        return this.artist;
    }
    getImage() {
        return this.image;
    }
}

class myPlaylist {
    constructor() {
        this.name = '';
        this.tracks = [];
        this.image = '';
        this.id = '';
    }

    setName(name) {
        this.name = name;
    }
    setTracks(tracks) {
        this.tracks = tracks;
    }
    setImage(image) {
        this.image = image;
    }

    setPlaylistID(id) {
        this.id = id;
    }
    getName() {
        return this.name;
    }
    getTracks() {
        return this.tracks;
    }
    getImage() {
        return this.image;
    }
    getPlaylistID() {
        return this.id;
    }

    addTrack(track) {
        this.tracks.push(track);
    }
}

class MyContainer {
    constructor() {
        this.playlists = [];
    }

    setPlaylists(playlists) {
        this.playlists = playlists;
    }
    getPlaylists() {
        return this.playlists;
    }

    addPlaylist(playlist) {
        this.playlists.push(playlist);
    }
}

function getAllMyPlaylists() {
    //console.log(allPlaylists);
    const params = parseParams(window.location.hash);
    if (!params.access_token) {
        window.location.href = authorizeUrl(CLIENT_ID, REDIRECT_URI);
    } else {
        return getPlaylists(params.access_token).then(response => {
            let allPlaylists = new MyContainer;
            response.items.forEach(playlist => {
                let nameP = playlist.name;
                let imageP = playlist.images[0].url;
                let tracksP = [];
                let newPlaylist = new myPlaylist();
                let idP = playlist.id;
                newPlaylist.setName(nameP);
                newPlaylist.setImage(imageP);
                newPlaylist.setTracks(tracksP);
                newPlaylist.setPlaylistID(idP);

                allPlaylists.addPlaylist(newPlaylist);
            })
            return allPlaylists;
        })
    }
}

function getAllPlaylistsTracks(specificPlaylist) {
    const params = parseParams(window.location.hash);
    if (!params.access_token) {
        window.location.href = authorizeUrl(CLIENT_ID, REDIRECT_URI);
    } else {
        return getAllMyPlaylists().then(
            response => {
                //console.log(JSON.stringify(response, null, ' '));
                response.playlists.forEach(playlist => {
                    //let allPlaylists = new MyContainer;
                    return getPlaylistTracks(params.access_token, playlist.id)
                        .then(
                            response => {
                                //let allPlaylists = new MyContainer;
                                response.items.forEach(item => {
                                    let nameT = item.track.name;
                                    let artistT = item.track.artists[0].name;
                                    let imageT = item.track.album.images[1].url;
                                    let newTrack = new MyTrack;
                                    newTrack.setName(nameT);
                                    newTrack.setArtist(artistT);
                                    newTrack.setImage(imageT);

                                    playlist.addTrack(newTrack);
                                });
                                if (playlist.name === specificPlaylist) {
                                    document.getElementById('wr').innerHTML = '';
                                    let wra = document.createElement('div');
                                    wra.className = 'wrapper';
                                    document.getElementById('wr').appendChild(wra);

                                    b = document.createElement("button");
                                    b.onclick = function() {
                                        document.getElementById('wr').innerHTML = '';
                                        showAllPlaylistsCards();
                                    }
                                    wra.appendChild(b);

                                    wr = document.createElement("ul");
                                    wra.appendChild(wr);

                                    playlist.tracks.forEach(item => {
                                        //create a new playlist card
                                        divPlaylist = document.createElement('div');
                                        divPlaylist.className = "card";
                                        wr.appendChild(divPlaylist);

                                        //image
                                        imageUrl = document.createElement('img');
                                        imageUrl.src = item.image;
                                        divPlaylist.appendChild(imageUrl);

                                        //info
                                        info = document.createElement('div');
                                        info.className = 'info';
                                        divPlaylist.appendChild(info);

                                        paragraph = document.createElement('h6');
                                        paragraphText = document.createTextNode(playlist.name + ' playlist');
                                        paragraph.appendChild(paragraphText);
                                        info.appendChild(paragraph);

                                        infoTitle = document.createElement('h1');
                                        infoTitleText = document.createTextNode(item.artist);
                                        infoTitle.appendChild(infoTitleText);
                                        info.appendChild(infoTitle);

                                        paragraph = document.createElement('h3');
                                        paragraphText = document.createTextNode(item.name);
                                        paragraph.appendChild(paragraphText);
                                        info.appendChild(paragraph);
                                    });

                                }
                            })
                })
            }
        );
    }
}

function showAllPlaylistsCards() {
    let wra = document.createElement('div');
    wra.className = 'wrapper';
    document.getElementById('wr').appendChild(wra);

    document.getElementsByClassName('title-page').innerHTML = "Playlists";

    getAllMyPlaylists().then(
        response => {
            wr = document.createElement("ul");
            wra.appendChild(wr);
            response.playlists.forEach(item => {
                //create a new playlist - with dynamic-link so we can click on it and redirect to all that playlist's tracks
                divPlaylist = document.createElement('div');
                divPlaylist.className = "dynamic-link";
                divPlaylist.id = 'p-id';
                divPlaylist.onclick = function() {
                    alert('you clicked on ' + item.name + ' playlist');
                    getAllPlaylistsTracks(item.name);
                }
                wr.appendChild(divPlaylist);

                //image
                imagePlaylist = document.createElement('img');
                imagePlaylist.src = item.image;
                divPlaylist.appendChild(imagePlaylist);

                //playlist name
                info = document.createElement('div');
                info.className = 'info';
                divPlaylist.appendChild(info);
                namePlaylist = document.createElement('h2');
                namePlaylistText = document.createTextNode(item.name + ' playlist');
                namePlaylist.appendChild(namePlaylistText);
                info.appendChild(namePlaylist);
            })
        })
}

showAllPlaylistsCards();

class Controller {
    constructor(container) {
        this.container = container;
    }

    setContainer(container) {
        this.container = container;
    }

    showPlaylistCards() {}
}