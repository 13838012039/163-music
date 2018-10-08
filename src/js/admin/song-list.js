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


            let { songs, selectSongId } = data
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
                if (song.id === selectSongId) {
                    $li.addClass('active')
                }
                return $li
            })

            // console.log(liList)

            $el.find('ul').empty()
            console.log($el.find('ul'))
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
                    // console.log($el.find('ul'))
            })


        },
        // activeItem(li) {
        //     let $li = $(li)
        //     $li.addClass('active')
        //         .siblings('.active')
        //         .removeClass('active')
        // },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectSongId: undefined,
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
                // this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')

                this.model.data.selectSongId = songId
                this.view.render(this.model.data)


                // let name = e.currentTarget.textContent
                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === songId) {
                        data = songs[i]
                        break
                    }
                }
                console.log('for后的data')
                console.log(data)
                    //深拷贝
                let string = JSON.stringify(data)
                let object = JSON.parse(string)
                window.eventHub.emit('select', object)
            })

        },
        bindEventsHub() {

            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.view.clearActive()
            })
            window.eventHub.on('update', (song) => {
                let songs = this.model.data.songs
                    // debugger
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === song.id) {
                        // songs[i] = song
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })

        }

    }
    controller.init(view, model)

    // window.app.songList = controller
}