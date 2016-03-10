# asciiflut

__Terminal only__ [pixelflut](https://github.com/defnull/pixelflut) clone

[[http://i.imgur.com/MeZ0ThC.jpg|alt=screenshot]]

## Install
```bash
git clone https://github.com/nooitaf/asciiflut
cd asciiflut
npm install
```
## Start Server
```bash
node server.js
```
## Run a Client
```bash
cd examples
node square.js
```
Check ip's,ports and canvas sizes,  
no settings or autodetects yet

### Note:
Fluters you already used for pixelflut should work too.  
Asciifluter accepts 2 more values, a character and a foreground-color.

### Message format:
```
PX 43 24 FF0000 X 00FF00

[COMMAND] [X] [Y] [BGCOLOR] [ASCIICHAR] [FGCOLOR]
```

### Todo
- implement missing pixelflut commands
- fps counter
