FROM ossrs/srs:latest

COPY srs.conf /usr/local/srs/conf/srs.conf

EXPOSE 1935 8080 10080/udp

CMD ["/usr/local/srs/objs/srs", "-c", "/usr/local/srs/conf/http.hooks.callback.conf"]
