
(async function() {
    const bruh = {
        text: 'bruh'
    };

    function change(text) {
        text.text = "nig";

        return text;
    }

    bruh.text = 'nig';
    console.log(typeof bruh);
})();