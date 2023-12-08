set /P url=Enter url: 

start ./yt-dlp_win/yt-dlp.exe --config-location ./config.txt %url%
