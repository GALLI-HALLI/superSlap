import React, { memo, useEffect, useMemo, useRef } from "react";
import { Socket } from "socket.io-client";
import { SocketServerEvent } from "../../constants/socket";