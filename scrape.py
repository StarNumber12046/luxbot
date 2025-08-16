# Saves all facts from a .har file to a json file

from dataclasses import dataclass
import json
from turtle import st
from typing import Any, List, Dict, TypeVar, Type, Callable, cast
from enum import Enum
from datetime import datetime
import dateutil.parser


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def from_none(x: Any) -> Any:
    assert x is None
    return x


def from_bool(x: Any) -> bool:
    assert isinstance(x, bool)
    return x


def from_datetime(x: Any) -> datetime:
    return dateutil.parser.parse(x)


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def from_dict(f: Callable[[Any], T], x: Any) -> Dict[str, T]:
    assert isinstance(x, dict)
    return { k: f(v) for (k, v) in x.items() }


def to_float(x: Any) -> float:
    assert isinstance(x, (int, float))
    return x


@dataclass
class Creator:
    name: str
    version: str

    @staticmethod
    def from_dict(obj: Any) -> 'Creator':
        assert isinstance(obj, dict)
        name = from_str(obj.get("name"))
        version = from_str(obj.get("version"))
        return Creator(name, version)

    def to_dict(self) -> dict:
        result: dict = {}
        result["name"] = from_str(self.name)
        result["version"] = from_str(self.version)
        return result


@dataclass
class Cache:
    pass

    @staticmethod
    def from_dict(obj: Any) -> 'Cache':
        assert isinstance(obj, dict)
        return Cache()

    def to_dict(self) -> dict:
        result: dict = {}
        return result


class FunctionName(Enum):
    A_END = "A._end"
    CH = "ch"
    C_O = "cO"
    E = "E"
    EMPTY = ""
    EVAL = "eval"
    FETCH = "fetch"
    FETCH_MESSAGES = "fetchMessages"
    FUNCTION_NAME_A_END = "A.end"
    I = "I"
    L_THEN = "l.then"
    MAKE_REQUEST = "makeRequest"
    TJ = "tj"
    UK = "uk"
    U_G = "uG"
    Y = "y"


@dataclass
class CallFrame:
    function_name: FunctionName
    script_id: int
    url: str
    line_number: int
    column_number: int

    @staticmethod
    def from_dict(obj: Any) -> 'CallFrame':
        assert isinstance(obj, dict)
        function_name = FunctionName(obj.get("functionName"))
        script_id = int(from_str(obj.get("scriptId")))
        url = from_str(obj.get("url"))
        line_number = from_int(obj.get("lineNumber"))
        column_number = from_int(obj.get("columnNumber"))
        return CallFrame(function_name, script_id, url, line_number, column_number)

    def to_dict(self) -> dict:
        result: dict = {}
        result["functionName"] = to_enum(FunctionName, self.function_name)
        result["scriptId"] = from_str(str(self.script_id))
        result["url"] = from_str(self.url)
        result["lineNumber"] = from_int(self.line_number)
        result["columnNumber"] = from_int(self.column_number)
        return result


@dataclass
class Stack:
    call_frames: List[CallFrame]

    @staticmethod
    def from_dict(obj: Any) -> 'Stack':
        assert isinstance(obj, dict)
        call_frames = from_list(CallFrame.from_dict, obj.get("callFrames"))
        return Stack(call_frames)

    def to_dict(self) -> dict:
        result: dict = {}
        result["callFrames"] = from_list(lambda x: to_class(CallFrame, x), self.call_frames)
        return result


class TypeEnum(Enum):
    SCRIPT = "script"


@dataclass
class Initiator:
    type: TypeEnum
    stack: Stack

    @staticmethod
    def from_dict(obj: Any) -> 'Initiator':
        assert isinstance(obj, dict)
        type = TypeEnum(obj.get("type"))
        stack = Stack.from_dict(obj.get("stack"))
        return Initiator(type, stack)

    def to_dict(self) -> dict:
        result: dict = {}
        result["type"] = to_enum(TypeEnum, self.type)
        result["stack"] = to_class(Stack, self.stack)
        return result


class Priority(Enum):
    HIGH = "High"


@dataclass
class Header:
    name: str
    value: str

    @staticmethod
    def from_dict(obj: Any) -> 'Header':
        assert isinstance(obj, dict)
        name = from_str(obj.get("name"))
        value = from_str(obj.get("value"))
        return Header(name, value)

    def to_dict(self) -> dict:
        result: dict = {}
        result["name"] = from_str(self.name)
        result["value"] = from_str(self.value)
        return result


class HTTPVersion(Enum):
    H3 = "h3"


class Method(Enum):
    GET = "GET"


@dataclass
class Request:
    method: Method
    url: str
    http_version: HTTPVersion
    headers: List[Header]
    query_string: List[Header]
    cookies: List[Any]
    headers_size: int
    body_size: int

    @staticmethod
    def from_dict(obj: Any) -> 'Request':
        assert isinstance(obj, dict)
        method = Method(obj.get("method"))
        url = from_str(obj.get("url"))
        http_version = HTTPVersion(obj.get("httpVersion"))
        headers = from_list(Header.from_dict, obj.get("headers"))
        query_string = from_list(Header.from_dict, obj.get("queryString"))
        cookies = from_list(lambda x: x, obj.get("cookies"))
        headers_size = from_int(obj.get("headersSize"))
        body_size = from_int(obj.get("bodySize"))
        return Request(method, url, http_version, headers, query_string, cookies, headers_size, body_size)

    def to_dict(self) -> dict:
        result: dict = {}
        result["method"] = to_enum(Method, self.method)
        result["url"] = from_str(self.url)
        result["httpVersion"] = to_enum(HTTPVersion, self.http_version)
        result["headers"] = from_list(lambda x: to_class(Header, x), self.headers)
        result["queryString"] = from_list(lambda x: to_class(Header, x), self.query_string)
        result["cookies"] = from_list(lambda x: x, self.cookies)
        result["headersSize"] = from_int(self.headers_size)
        result["bodySize"] = from_int(self.body_size)
        return result


class ResourceType(Enum):
    XHR = "xhr"


class MIMEType(Enum):
    APPLICATION_JSON = "application/json"


@dataclass
class Content:
    size: int
    mime_type: MIMEType
    text: str

    @staticmethod
    def from_dict(obj: Any) -> 'Content':
        assert isinstance(obj, dict)
        size = from_int(obj.get("size"))
        mime_type = MIMEType(obj.get("mimeType"))
        text = from_str(obj.get("text"))
        return Content(size, mime_type, text)

    def to_dict(self) -> dict:
        result: dict = {}
        result["size"] = from_int(self.size)
        result["mimeType"] = to_enum(MIMEType, self.mime_type)
        result["text"] = from_str(self.text)
        return result


@dataclass
class Response:
    status: int
    status_text: str
    http_version: HTTPVersion
    headers: List[Header]
    cookies: List[Any]
    content: Content
    redirect_url: str
    headers_size: int
    body_size: int
    transfer_size: int
    error: None
    fetched_via_service_worker: bool

    @staticmethod
    def from_dict(obj: Any) -> 'Response':
        assert isinstance(obj, dict)
        status = from_int(obj.get("status"))
        status_text = from_str(obj.get("statusText"))
        http_version = HTTPVersion(obj.get("httpVersion"))
        headers = from_list(Header.from_dict, obj.get("headers"))
        cookies = from_list(lambda x: x, obj.get("cookies"))
        content = Content.from_dict(obj.get("content"))
        redirect_url = from_str(obj.get("redirectURL"))
        headers_size = from_int(obj.get("headersSize"))
        body_size = from_int(obj.get("bodySize"))
        transfer_size = from_int(obj.get("_transferSize"))
        error = from_none(obj.get("_error"))
        fetched_via_service_worker = from_bool(obj.get("_fetchedViaServiceWorker"))
        return Response(status, status_text, http_version, headers, cookies, content, redirect_url, headers_size, body_size, transfer_size, error, fetched_via_service_worker)

    def to_dict(self) -> dict:
        result: dict = {}
        result["status"] = from_int(self.status)
        result["statusText"] = from_str(self.status_text)
        result["httpVersion"] = to_enum(HTTPVersion, self.http_version)
        result["headers"] = from_list(lambda x: to_class(Header, x), self.headers)
        result["cookies"] = from_list(lambda x: x, self.cookies)
        result["content"] = to_class(Content, self.content)
        result["redirectURL"] = from_str(self.redirect_url)
        result["headersSize"] = from_int(self.headers_size)
        result["bodySize"] = from_int(self.body_size)
        result["_transferSize"] = from_int(self.transfer_size)
        result["_error"] = from_none(self.error)
        result["_fetchedViaServiceWorker"] = from_bool(self.fetched_via_service_worker)
        return result


class ServerIPAddress(Enum):
    THE_162159128233 = "162.159.128.233"


@dataclass
class Entry:
    connection_id: int
    initiator: Initiator
    priority: Priority
    resource_type: ResourceType
    cache: Cache
    connection: int
    request: Request
    response: Response
    server_ip_address: ServerIPAddress
    started_date_time: datetime
    time: float
    timings: Dict[str, float]

    @staticmethod
    def from_dict(obj: Any) -> 'Entry':
        assert isinstance(obj, dict)
        connection_id = int(from_str(obj.get("_connectionId")))
        initiator = Initiator.from_dict(obj.get("_initiator"))
        priority = Priority(obj.get("_priority"))
        resource_type = ResourceType(obj.get("_resourceType"))
        cache = Cache.from_dict(obj.get("cache"))
        connection = int(from_str(obj.get("connection")))
        request = Request.from_dict(obj.get("request"))
        response = Response.from_dict(obj.get("response"))
        server_ip_address = ServerIPAddress(obj.get("serverIPAddress"))
        started_date_time = from_datetime(obj.get("startedDateTime"))
        time = from_float(obj.get("time"))
        timings = from_dict(from_float, obj.get("timings"))
        return Entry(connection_id, initiator, priority, resource_type, cache, connection, request, response, server_ip_address, started_date_time, time, timings)

    def to_dict(self) -> dict:
        result: dict = {}
        result["_connectionId"] = from_str(str(self.connection_id))
        result["_initiator"] = to_class(Initiator, self.initiator)
        result["_priority"] = to_enum(Priority, self.priority)
        result["_resourceType"] = to_enum(ResourceType, self.resource_type)
        result["cache"] = to_class(Cache, self.cache)
        result["connection"] = from_str(str(self.connection))
        result["request"] = to_class(Request, self.request)
        result["response"] = to_class(Response, self.response)
        result["serverIPAddress"] = to_enum(ServerIPAddress, self.server_ip_address)
        result["startedDateTime"] = self.started_date_time.isoformat()
        result["time"] = to_float(self.time)
        result["timings"] = from_dict(to_float, self.timings)
        return result


@dataclass
class Log:
    version: str
    creator: Creator
    pages: List[Any]
    entries: List[Entry]

    @staticmethod
    def from_dict(obj: Any) -> 'Log':
        assert isinstance(obj, dict)
        version = from_str(obj.get("version"))
        creator = Creator.from_dict(obj.get("creator"))
        pages = from_list(lambda x: x, obj.get("pages"))
        entries = from_list(Entry.from_dict, obj.get("entries"))
        return Log(version, creator, pages, entries)

    def to_dict(self) -> dict:
        result: dict = {}
        result["version"] = from_str(self.version)
        result["creator"] = to_class(Creator, self.creator)
        result["pages"] = from_list(lambda x: x, self.pages)
        result["entries"] = from_list(lambda x: to_class(Entry, x), self.entries)
        return result


@dataclass
class Stuff:
    log: Log

    @staticmethod
    def from_dict(obj: Any) -> 'Stuff':
        assert isinstance(obj, dict)
        log = Log.from_dict(obj.get("log"))
        return Stuff(log)

    def to_dict(self) -> dict:
        result: dict = {}
        result["log"] = to_class(Log, self.log)
        return result


def stuff_from_dict(s: Any) -> Stuff:
    return Stuff.from_dict(s)


def stuff_to_dict(x: Stuff) -> Any:
    return to_class(Stuff, x)

data = json.load(open("discord.com.har", "r"))
stuff = stuff_from_dict(data)

facts = []

for entry in stuff.log.entries:
    facts_page = json.loads(entry.response.content.text)
    messages = facts_page["messages"]
    for message in messages:
        msg = message[0]
        embed = msg["embeds"][0]
        description = embed["description"]
        fact = description.split("**\n> ")[1]
        accuracy = int(embed["footer"]["text"].replace("Accuracy: ", "").replace("%", ""))
        # Skip if already exists
        should_skip = False
        for fact_, accuracy_ in facts:
            if fact == fact_:
                print(f"Skipping {fact}")
                should_skip = True
                continue
        if should_skip:
            continue
        print(f"Adding {fact}")
        facts.append((fact, accuracy / 100))
print("Got " + str(len(facts)) + " facts")
json.dump(facts, open("facts.json", "w"))
