{
    let view = {
        el: "#songList-container",
        template: `
        <ul class='songList'>
                 

                </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)


            let { songs } = data
            let liList = songs.map((song) => $('<li></li>').text(song.name))

            // console.log(liList)

            $el.find('ul').empty()
            console.log($el.find('ul'))
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
                    // console.log($el.find('ul'))
            })


        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        }
    }
    let controller = {
        init() {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
        }

    }
    controller.init(view, model)

    // window.app.songList = controller
}