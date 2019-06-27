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
    // console.log(SPOTIFY_PLAYLIST_TRACKS_URL);
    // console.log(SPOTIFY_PLAYLIST_TRACKS_URL.replace(/id/, playlistId));
    fetch(SPOTIFY_API_ROOT + SPOTIFY_PLAYLIST_TRACKS_URL.replace(/id/, playlistId), {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
        node: 'cors',
        method: 'GET',
    }).then(response => response.json());

let myTrack = {
    name: '',
    artist: '',
    image: ''
}

let myPlaylist = {
    name: '',
    tracks: []
}
let allMusic = [];

let plist, track, index = 0;
let wra = document.createElement('div');
wra.className = 'wrapper';
document.getElementById('wr').appendChild(wra);

const params = parseParams(window.location.hash);
if (!params.access_token) {
    window.location.href = authorizeUrl(CLIENT_ID, REDIRECT_URI);
} else {
    getPlaylists(params.access_token).then(response => {
        response.items.forEach(playlist => {
            //console.log('Playlist: ' + playlist.name);
            //console.log('Playlist id is:' + playlist.id);
            getPlaylistTracks(params.access_token, playlist.id).then(
                response => {
                    //console.log('Playlist name:', playlist.name);
                    wr = document.createElement("ul");
                    wra.appendChild(wr);

                    response.items.forEach(item => {
                        let myp = playlist;

                        //create a new playlist card
                        myPlaylist = document.createElement('div');
                        myPlaylist.className = "card";
                        wr.appendChild(myPlaylist);

                        //image
                        imageUrl = document.createElement('img');
                        imageUrl.src = item.track.album.images[1].url;
                        myPlaylist.appendChild(imageUrl);

                        //info
                        info = document.createElement('div');
                        info.className = 'info';
                        myPlaylist.appendChild(info);

                        paragraph = document.createElement('h6');
                        paragraphText = document.createTextNode(playlist.name + ' playlist');
                        paragraph.appendChild(paragraphText);
                        info.appendChild(paragraph);

                        infoTitle = document.createElement('h1');
                        infoTitleText = document.createTextNode(item.track.artists[0].name);
                        infoTitle.appendChild(infoTitleText);
                        info.appendChild(infoTitle);

                        paragraph = document.createElement('h3');
                        paragraphText = document.createTextNode(item.track.name);
                        paragraph.appendChild(paragraphText);
                        info.appendChild(paragraph);

                        // button = document.createElement('button');
                        // buttonText = document.createTextNode('click me');
                        // button.appendChild(buttonText);
                        // info.appendChild(button);
                    });
                }
            )
        })
    })
}