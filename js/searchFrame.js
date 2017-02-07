var searchFrame = {
    _count: 1,

    init: function() {
        $('#refresh').click(function() {
            app.removeSearchFrame();
            //app.getSearchFrame();
        });
        alert(this._count);
        this._count ++;
        alert(count2++);
    },
    destroy: function() {
        alert("destroy " + (this._count - 1));
    }
}