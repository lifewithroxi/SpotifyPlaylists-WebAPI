const CLIENT_ID = '297380c742a34234b7ce782545c5f44c';
//const REDIRECT_URI = 'http://127.0.0.1:8080/code.html';
const REDIRECT_URI = 'http://localhost:8080';
//const REDIRECT_URI = 'http://127.0.0.1:8080/script.js';

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

let node, nodeInfo;

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
                    console.log('Playlist name:', playlist.name);
                    node = document.createElement("ul");
                    nodeInfo = document.createTextNode(playlist.name);
                    node.id = playlist.name;
                    node.appendChild(nodeInfo);
                    document.getElementById("lists").appendChild(node);
                    listID = node.id;
                    //console.log('Response is: ', response);
                    //console.log('Items are: ', response.items);
                    console.log(response.items[0]);
                    response.items.forEach(item => {
                        // console.log(item.track.name);
                        // node = document.createElement("li");
                        // nodeInfo = document.createTextNode(item.track.name);
                        // node.appendChild(nodeInfo);
                        // document.getElementById(listID).appendChild(node);

                        imgNode = document.createElement("img");
                        imgNodeInfo = document.createTextNode(item.track.name);
                        imgNode.url = item.track.album.images[1].url;
                        imgNode.appendChild(imgNodeInfo);
                        document.getElementById(listID).appendChild(node);
                    });

                }
            )
        })
    })
}