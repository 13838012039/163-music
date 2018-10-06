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
        activeItem(li) {
            let $li = $(li)
            $li.addClass('active')
                .siblings('.active')
                .removeClass('active')
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init() {
            this.view = view
            this.model = model

            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventsHub()
            this.getAllSongs()


        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
            })

        },
        bindEventsHub() {
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