document.addEventListener('DOMContentLoaded', function() {
    // clipboard
    var clipInit = false;
    var codes = document.querySelectorAll('code') || [];
    codes.forEach(function(code) {
        var text = code.innerHTML;

        if (text.length > 5) {
            if (!clipInit) {
                var text, clip = new ClipboardJS('.copy-to-clipboard', {
                    text: function(trigger) {
                        text = trigger.previousSibling.innerHTML;
                        return text.replace(/^\$\s/gm, '');
                    }
                });

                var inPre;
                clip.on('success', function(e) {
                    e.clearSelection();
                    inPre = e.trigger.parentNode.tagName == 'PRE';
                    e.trigger.setAttribute('aria-label', 'Copied to clipboard!');
                    e.trigger.classList.add('tooltipped');
                    e.trigger.classList.add('tooltipped-' + (inPre ? 'w' : 's'));
                });

                clip.on('error', function(e) {
                    inPre = e.trigger.parentNode.tagName == 'PRE';
                    e.trigger.setAttribute('aria-label', fallbackMessage(e.action));
                    e.trigger.classList.add('tooltipped');
                    e.trigger.classList.add('tooltipped-' + (inPre ? 'w' : 's'));
                    document.addEventListener('copy', function(){
                        e.trigger.setAttribute('aria-label', 'Copied to clipboard!');
                        e.trigger.classList.add('tooltipped');
                        e.trigger.classList.add('tooltipped-' + (inPre ? 'w' : 's'));
                    });
                });

                clipInit = true;
            }

            var copyNode = document.createElement('div');
            copyNode.classList.add('copy-to-clipboard');
            copyNode.setAttribute('title', 'Copy to clipboard');

            code.after(copyNode);
            code.nextSibling.addEventListener('mouseleave', function() {
                this.setAttribute('aria-label', null);
                this.classList.remove('tooltipped');
                this.classList.remove('tooltipped-s');
                this.classList.remove('tooltipped-w');
            });
        }
    });

}, false);