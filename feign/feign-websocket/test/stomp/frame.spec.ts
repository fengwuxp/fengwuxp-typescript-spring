import * as log4js from "log4js";
import {StompFrameImpl} from "../../src/stomp/stomp-frame-impl";
import {StompCommand} from "../../src/stomp/StompCommand";
import {StompFrameParser} from "../../src/stomp/stomp-frame-parser";
import "./fix-node-text-encoding.test";

const logger = log4js.getLogger();
logger.level = 'debug';


describe("test stomp frame", () => {

    // un-marshall a data chunk, for ease of matching body is converted to string
    const unmarshall = function (data, escapeHeaderValues = false) {
        const onFrame = jasmine.createSpy('onFrame');
        const onIncomingPing = jasmine.createSpy('onIncomingPing');
        const parser = new StompFrameParser(onFrame, onIncomingPing);

        parser.parseChunk(data);

        const rawFrame = onFrame.calls.first().args[0];
        return StompFrameImpl.fromRawFrame(rawFrame, escapeHeaderValues);
    };

    it('escape header value', function () {
        const out = StompFrameImpl.hdrValueEscape(
            'anything\\a\nb\nc\rd\re:f:\\anything\\a\nb\nc\rd\re:f:\\'
        );
        expect(out).toEqual(
            'anything\\\\a\\nb\\nc\\rd\\re\\cf\\c\\\\anything\\\\a\\nb\\nc\\rd\\re\\cf\\c\\\\'
        );
    });

    it('escapes and then unescapes header value to give original string', function () {
        const orig = 'anything\\a\nb\nc\rd\re:f:\\anything\\a\nb\nc\rd\re:f:\\';
        const out = StompFrameImpl.hdrValueUnEscape(
            StompFrameImpl.hdrValueEscape(orig)
        );
        expect(out).toEqual(orig);
    });

    it('marshall a CONNECT frame', function () {
        const out = StompFrameImpl.marshall({
            command: StompCommand.CONNECT,
            headers: {login: 'jmesnil', passcode: 'wombats'},
        });
        expect(out).toEqual('CONNECT\nlogin:jmesnil\npasscode:wombats\n\n\0');
    });

    it('marshall a SEND frame', function () {
        const out = StompFrameImpl.marshall({
            command: StompCommand.SEND,
            headers: {destination: '/queue/test'},
            body: 'hello, world!',
        });
        expect(out).toEqual(
            'SEND\ndestination:/queue/test\ncontent-length:13\n\nhello, world!\0'
        );
    });

    it('marshall a SEND frame without content-length', function () {
        const out = StompFrameImpl.marshall({
            command: StompCommand.SEND,
            headers: {destination: '/queue/test'},
            body: 'hello, world!',
            skipContentLengthHeader: true,
        });
        expect(out).toEqual('SEND\ndestination:/queue/test\n\nhello, world!\0');
    });

    it('unmarshall a CONNECTED frame', function () {
        const data = 'CONNECTED\nsession-id: 1234\n\n\0';
        const frame = unmarshall(data);
        expect(frame.command).toEqual('CONNECTED');
        expect(frame.headers).toEqual({'session-id': '1234'});
        expect(frame.body).toEqual('');
    });

    it('unmarshall a RECEIVE frame', function () {
        const data = 'RECEIVE\nfoo: abc\nbar: 1234\n\nhello, world!\0';
        const frame = unmarshall(data);
        expect(frame.command).toEqual('RECEIVE');
        expect(frame.headers).toEqual({foo: 'abc', bar: '1234'});
        expect(frame.body).toEqual('hello, world!');
    });

    it('unmarshall should not include the null byte in the body', function () {
        const body1 = 'Just the text please.',
            body2 = 'And the newline\n',
            msg = 'MESSAGE\ndestination: /queue/test\nmessage-id: 123\n\n';

        expect(unmarshall(msg + body1 + '\0').body).toEqual(body1);
        expect(unmarshall(msg + body2 + '\0').body).toEqual(body2);
    });

    it('unmarshall should support colons (:) in header values', function () {
        const dest = 'foo:bar:baz',
            msg = 'MESSAGE\ndestination: ' + dest + '\nmessage-id: 456\n\n\0';

        expect(unmarshall(msg).headers.destination).toEqual(dest);
    });

    it('unmarshall should support colons (:) in header values with escaping', function () {
        const dest = 'foo:bar:baz',
            msg =
                'MESSAGE\ndestination: ' +
                'foo\\cbar\\cbaz' +
                '\nmessage-id: 456\n\n\0';

        expect(unmarshall(msg, true).headers.destination).toEqual(dest);
    });

    it('unmarshall should support \\, \\n and \\r in header values with escaping', function () {
        const dest = 'f:o:o\nbar\rbaz\\foo\nbar\rbaz\\',
            msg =
                'MESSAGE\ndestination: ' +
                'f\\co\\co\\nbar\\rbaz\\\\foo\\nbar\\rbaz\\\\' +
                '\nmessage-id: 456\n\n\0';

        expect(unmarshall(msg, true).headers.destination).toEqual(dest);
    });

    it('marshall should support \\, \\n and \\r in header values with escaping', function () {
        const dest = 'f:o:o\nbar\rbaz\\foo\nbar\rbaz\\',
            msg =
                'MESSAGE\ndestination:' +
                'f\\co\\co\\nbar\\rbaz\\\\foo\\nbar\\rbaz\\\\' +
                '\nmessage-id:456\n\n\0';

        expect(
            StompFrameImpl.marshall({
                command: StompCommand.MESSAGE,
                headers: {destination: dest, 'message-id': '456'},
                body: '',
                escapeHeaderValues: true,
            })
        ).toEqual(msg);
    });

    it('marshal/unmarshall should support \\, \\n and \\r in header values with escaping', function () {
        const dest = 'f:o:o\nbar\rbaz\\foo\nbar\rbaz\\';
        const command = StompCommand.MESSAGE;
        const headers = {destination: dest, 'message-id': '456'};
        const body = '';

        const msg = StompFrameImpl.marshall({
            command,
            headers: headers,
            body: body,
            escapeHeaderValues: true,
        });
        const frame = unmarshall(msg, true);

        expect(frame.headers).toEqual(headers);
    });

    it('only the 1st value of repeated headers is used', function () {
        const msg = 'MESSAGE\ndestination: /queue/test\nfoo:World\nfoo:Hello\n\n\0';

        expect(unmarshall(msg).headers['foo']).toEqual('World');
    });

    it('Content length of UTF-8 strings', function () {
        expect(0).toEqual(StompFrameImpl.sizeOfUTF8());
        expect(0).toEqual(StompFrameImpl.sizeOfUTF8(''));
        expect(1).toEqual(StompFrameImpl.sizeOfUTF8('a'));
        expect(2).toEqual(StompFrameImpl.sizeOfUTF8('ф'));
        expect(3).toEqual(StompFrameImpl.sizeOfUTF8('№'));
        expect(15).toEqual(StompFrameImpl.sizeOfUTF8('1 a ф № @ ®'));
    });

});

