# Cosine-weighted hemisphere visualization with Motion Canvas

![foo]("media/random_unit_vector.gif")

These animations were created with [Motion Canvas](https://motioncanvas.io) to aid me in a [Mastodon discussion](https://mastodon.gamedev.place/@mynameistrez/110132648398286786).

## The animation started as a sketch

<img src="media/random_vector.gif" width=20% />

## Running

1. Execute `npm run serve` in the repository
2. Go to http://localhost:9000/ in your browser

## Render

First you have to generate the PNG frames:
1. Go to http://localhost:9000/ in your browser
2. Click the `Video Settings` button on the left
3. Press the blue `RENDER` button

### mp4

`ffmpeg -framerate 60 -i output/project/%06d.png -crf 1 output/output.mp4`

### webm

`ffmpeg -framerate 60 -i output/project/%06d.png -crf 1 output/output.webm`

### gif

Create GIF directly from the output PNGs, which creates a huge GIF:

`ffmpeg -f image2 -framerate 60 -i output/project/%06d.png output/output.gif`

Create GIF from the WEBM, which creates a much smaller GIF.
See [this post](https://superuser.com/a/556031/1287700) for an explanation of the command.
Note that the FPS of 60 and scale of 1920 settings here cause it to take a really long time to render, so you probably want to lower them a little:

`ffmpeg -i output/output.webm -vf "fps=60,scale=1920:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output/output.gif`
