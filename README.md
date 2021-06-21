<div align="center">
<img src='src/assets/homeLogo.png' width='100'>
<h1><strong>Downify</strong></h1>
<h2 >
    Downify let's you enjoy music on-the-go, even when you are offline.
    </h2>
</div>

<div align='center' >
<a href="https://github.com/samadritsarkar2/spotifyDown/blob/main/release/spotifyDown.apk?raw=true" >
Download Apk
</a>
 </div>
<br>

# 🎯 Goal

<h3>
Downify wants to make sure that, no one is deprived of music on that long road trip or airplane when there is no Internet Connection.
You can download your Spotify playlists/albums in advance and enjoy music everywhere. And that too without annoying ads.
</h3>
<br>
<br>

# Screenshots

<div>
    <img src="screenshots/1.png" width="200" />
    <img src="screenshots/2.png" width="200" />
    <img src="screenshots/3.png" width="200" />
    <img src="screenshots/4.png" width="200" />
    <img src="screenshots/5.png" width="200" />
</div>
<br>
<br>

# Changelog

- [**v1.5**](https://github.com/samadritsarkar2/spotifyDown/tree/version1.5)
  - Added Music Player
  - Added Notification Bar Music controller
  - Supports Spotify Albums now, alongside Playlists
  - Added Downloads Page
  - Added a Mini player component ( Will add more features to it via OTA Updates )
  - Support for OTA Updates
  - UI Changes
  - For more, see [CHANGELOG](/CHANGELOG.MD)
    <br>
    <br>
- [**v1**](https://github.com/samadritsarkar2/spotifyDown/tree/version1) (Intial Release)
  - Supports Spotify Playlist
  - Playing a downloaded a song, launches Music player Intent.
  - Download All functionality
  - Save the playlist for later

# How it works?

It uses <a href="https://developer.spotify.com/">Spotify offical API</a> to fetch the tracks and Youtube(youtube-dl) to download the tracks.

P.S:- ~~I have written a lot of Bad code, I will start improving the app and code soon.~~
I improved the code a little bit and the overall code structure. Will work on it soon.

# Tech Stack

- React Native
- Node Js (Backend Server) ~~[Will make the backend code public soon]~~
- Firebase (For Analytics)

# Known Issues

- While a track(/s) is getting downloaded from a particular playlist, if user exists the screen or another playlist is loaded, then the download gets cancelled.
- Few playlist may give error unexpectedly.
- Due to youtube policies, few songs are not downloadable. This is because some videos are regionally restriced or so. [See these limitations](https://github.com/fent/node-ytdl-core#limitations)
- Downloads wrong tracks
- If you encounter anything else, feel free to report an issue or DM me. I will definetly work on it.

# Upcoming Features

- [x] In-app Music Player
- [x] Support for Spotify Albums. ([#2](https://github.com/samadritsarkar2/spotifyDown/issues/2))
- [ ] In-app music controller such as, queue, seek bar etc.
- [ ] Optimized Download functionality
- [ ] Spotify Login to fetch playlists
- [x] Suggestions are always welcome.

# For Legal Purposes

    You can mail me at **samadrit.sarkar2@gmail.com** or DM me.
