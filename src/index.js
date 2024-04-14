require('dotenv').config()
const { Command } = require('commander')
const axios = require('axios').default
const fs = require('fs')

// Program constants
const testImageURL = 'https://picsum.photos/200/300'

// CLI Setup
const program = new Command()
program.name('star').description('CLI tool for Starry AI.').version('0.0.1')

program
    .command('user')
    .description(
        `Get the user information from StarryAI and return it to the console. It should include`,
    )
    .action((string, options) => {
        const getUserOptions = {
            method: 'GET',
            url: 'https://api.starryai.com/user/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.STARRYAI_KEY,
            },
        }

        axios
            .request(getUserOptions)
            .then((response) => {
                console.log(response.status)
                console.log(response.data)
            })
            .catch((error) => {
                const theReturnedError = error
                console.log('There was an error getting the user')
                console.log(`Error status: ${error.status}`)

                console.log(error.data)
            })
    })

program
    .command('get-creations')
    .description('Returns json with information about all the creations')
    .action((string, options) => {
        const getCreationsOptions = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.STARRYAI_KEY,
            },
        }
        axios
            .request(getCreationsOptions)
            .then((response) => {
                console.log(response.status)
                console.log(response.data)
                console.log(response.data[0].images)
            })
            .catch((error) => {
                const theReturnedError = error
                console.log('There was an error getting the user')
                console.log(`Error status: ${error.status}`)

                console.log(error.data)
            })
    })

program
    .command('new')
    .description('Create a new image with a prompt')
    .action((string, options) => {
        const newCreationOptions = {
            method: 'POST',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.STARRYAI_KEY,
                'content-type': 'application/json',
            },
            data: {
                model: 'lyra',
                aspectRatio: 'square',
                highResolution: false,
                images: 1,
                steps: 20,
                initialImageMode: 'color',
                prompt: 'cyberpunk flamingo',
            },
        }

        axios
            .request(newCreationOptions)
            .then((response) => {
                console.log(response)
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    })

program
    .command('download')
    .description('Download all the images')
    .action((string, options) => {
        const downloadOptions = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.STARRYAI_KEY,
            },
        }
        axios
            .request(downloadOptions)
            .then((response) => {
                response.data
                    .filter((res) => {
                        if (res.expired == true) {
                            return 'expired'
                        } else {
                            return res
                        }
                    })

                    .map((res) => {
                        const imageUrl = res.images[0].url
                        console.log(imageUrl)
                        axios
                            .get(imageUrl, { responseType: 'arraybuffer' })
                            .then((response) => {
                                const imageBuffer = Buffer.from(
                                    response.data,
                                    'binary',
                                )
                                fs.writeFile(
                                    `${res.response.data.id}.png`,
                                    imageBuffer,
                                    'binary',
                                    (error) => {
                                        if (error) {
                                            console.error(
                                                'An error occurred while saving the file:',
                                                error,
                                            )
                                        } else {
                                            console.log(
                                                'File saved successfully.',
                                            )
                                        }
                                    },
                                )
                            })
                    })
                // .map((res) => {
                //     console.log(res.images)
                //     const imageId = res.id
                //     console.log(imageId)
                //     axios
                //         .get(testImageURL, { responseType: 'arraybuffer' })
                //         .then((response) => {
                //             // Handle the response

                //             console.log(response)
                //             const imageBuffer = Buffer.from(
                //                 response.data,
                //                 'binary',
                //             )
                //             // Save or display the image as needed

                //             fs.writeFile(
                //                 'picture.jpg',
                //                 imageBuffer,
                //                 'binary',
                //                 (error) => {
                //                     if (error) {
                //                         console.error(
                //                             'An error occurred while saving the file:',
                //                             error,
                //                         )
                //                     } else {
                //                         console.log(
                //                             'File saved successfully.',
                //                         )
                //                     }
                //                 },
                //             )
                //         })
                //         .catch((error) => {
                //             console.error(
                //                 'An error occurred while retrieving the picture:',
                //                 error.message,
                //             )
                //         })
                // })
                // response.data.map((images) => {
                //     console.log(images)
                // })
            })
            .catch((error) => {
                const theReturnedError = error
                console.log('There was an error getting the user')
                console.log(`Error status: ${error.status}`)

                console.log(error.data)
            })
    })
program
    .command('hi')
    .description('Gives a friendly wave.')
    .action((string, options) => {
        const theString = string
        const theOptions = options

        console.log('Hellllloooooooooo!!!!!')

        axios
            .get(testImageURL, { responseType: 'arraybuffer' })
            .then((response) => {
                // Handle the response

                console.log(response)
                const imageBuffer = Buffer.from(response.data, 'binary')
                // Save or display the image as needed

                fs.writeFile('picture.jpg', imageBuffer, 'binary', (error) => {
                    if (error) {
                        console.error(
                            'An error occurred while saving the file:',
                            error,
                        )
                    } else {
                        console.log('File saved successfully.')
                    }
                })
            })
            .catch((error) => {
                console.error(
                    'An error occurred while retrieving the picture:',
                    error.message,
                )
            })
    })

program.parse()
