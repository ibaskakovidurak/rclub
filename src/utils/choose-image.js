export function chooseImage (e) {
    const img = document.getElementById(e.target.getAttribute('for'))

    img.addEventListener('change', (input) => {
        const files = input.target.files
        if (files.length > 0) {
            const reader = new FileReader()
            let imageView = document.querySelector('.account__image')

            reader.readAsDataURL(files[0])

            reader.onload = () => {
                if (!imageView){
                    const imageName = document.querySelector('.account__name')
                    const imageContainer = document.querySelector('.account__image-container')
                    const img = document.createElement('img')

                    img.classList.add('account__image')
                    imageView = img

                    imageContainer.appendChild(imageView)

                    imageName.remove()
                }
                imageView.src = reader.result
            }
        }
    })
}