// package: hollowdb
// file: protos/hollow.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as protos_hollow_pb from "../protos/hollow_pb";
import * as google_protobuf_struct_pb from "google-protobuf/google/protobuf/struct_pb";

interface IDBService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    write: IDBService_Iwrite;
    read: IDBService_Iread;
}

interface IDBService_Iwrite extends grpc.MethodDefinition<protos_hollow_pb.WriteRequest, protos_hollow_pb.WriteResponse> {
    path: "/hollowdb.DB/write";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<protos_hollow_pb.WriteRequest>;
    requestDeserialize: grpc.deserialize<protos_hollow_pb.WriteRequest>;
    responseSerialize: grpc.serialize<protos_hollow_pb.WriteResponse>;
    responseDeserialize: grpc.deserialize<protos_hollow_pb.WriteResponse>;
}
interface IDBService_Iread extends grpc.MethodDefinition<protos_hollow_pb.ReadRequest, protos_hollow_pb.ReadResponse> {
    path: "/hollowdb.DB/read";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<protos_hollow_pb.ReadRequest>;
    requestDeserialize: grpc.deserialize<protos_hollow_pb.ReadRequest>;
    responseSerialize: grpc.serialize<protos_hollow_pb.ReadResponse>;
    responseDeserialize: grpc.deserialize<protos_hollow_pb.ReadResponse>;
}

export const DBService: IDBService;

export interface IDBServer extends grpc.UntypedServiceImplementation {
    write: grpc.handleUnaryCall<protos_hollow_pb.WriteRequest, protos_hollow_pb.WriteResponse>;
    read: grpc.handleUnaryCall<protos_hollow_pb.ReadRequest, protos_hollow_pb.ReadResponse>;
}

export interface IDBClient {
    write(request: protos_hollow_pb.WriteRequest, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.WriteResponse) => void): grpc.ClientUnaryCall;
    write(request: protos_hollow_pb.WriteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.WriteResponse) => void): grpc.ClientUnaryCall;
    write(request: protos_hollow_pb.WriteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.WriteResponse) => void): grpc.ClientUnaryCall;
    read(request: protos_hollow_pb.ReadRequest, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.ReadResponse) => void): grpc.ClientUnaryCall;
    read(request: protos_hollow_pb.ReadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.ReadResponse) => void): grpc.ClientUnaryCall;
    read(request: protos_hollow_pb.ReadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.ReadResponse) => void): grpc.ClientUnaryCall;
}

export class DBClient extends grpc.Client implements IDBClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public write(request: protos_hollow_pb.WriteRequest, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.WriteResponse) => void): grpc.ClientUnaryCall;
    public write(request: protos_hollow_pb.WriteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.WriteResponse) => void): grpc.ClientUnaryCall;
    public write(request: protos_hollow_pb.WriteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.WriteResponse) => void): grpc.ClientUnaryCall;
    public read(request: protos_hollow_pb.ReadRequest, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.ReadResponse) => void): grpc.ClientUnaryCall;
    public read(request: protos_hollow_pb.ReadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.ReadResponse) => void): grpc.ClientUnaryCall;
    public read(request: protos_hollow_pb.ReadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_hollow_pb.ReadResponse) => void): grpc.ClientUnaryCall;
}
