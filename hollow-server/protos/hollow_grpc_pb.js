// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var protos_hollow_pb = require('../protos/hollow_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

function serialize_hollowdb_ReadRequest(arg) {
  if (!(arg instanceof protos_hollow_pb.ReadRequest)) {
    throw new Error('Expected argument of type hollowdb.ReadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hollowdb_ReadRequest(buffer_arg) {
  return protos_hollow_pb.ReadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hollowdb_ReadResponse(arg) {
  if (!(arg instanceof protos_hollow_pb.ReadResponse)) {
    throw new Error('Expected argument of type hollowdb.ReadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hollowdb_ReadResponse(buffer_arg) {
  return protos_hollow_pb.ReadResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hollowdb_WriteRequest(arg) {
  if (!(arg instanceof protos_hollow_pb.WriteRequest)) {
    throw new Error('Expected argument of type hollowdb.WriteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hollowdb_WriteRequest(buffer_arg) {
  return protos_hollow_pb.WriteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hollowdb_WriteResponse(arg) {
  if (!(arg instanceof protos_hollow_pb.WriteResponse)) {
    throw new Error('Expected argument of type hollowdb.WriteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hollowdb_WriteResponse(buffer_arg) {
  return protos_hollow_pb.WriteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var DBService = exports.DBService = {
  write: {
    path: '/hollowdb.DB/write',
    requestStream: false,
    responseStream: false,
    requestType: protos_hollow_pb.WriteRequest,
    responseType: protos_hollow_pb.WriteResponse,
    requestSerialize: serialize_hollowdb_WriteRequest,
    requestDeserialize: deserialize_hollowdb_WriteRequest,
    responseSerialize: serialize_hollowdb_WriteResponse,
    responseDeserialize: deserialize_hollowdb_WriteResponse,
  },
  read: {
    path: '/hollowdb.DB/read',
    requestStream: false,
    responseStream: false,
    requestType: protos_hollow_pb.ReadRequest,
    responseType: protos_hollow_pb.ReadResponse,
    requestSerialize: serialize_hollowdb_ReadRequest,
    requestDeserialize: deserialize_hollowdb_ReadRequest,
    responseSerialize: serialize_hollowdb_ReadResponse,
    responseDeserialize: deserialize_hollowdb_ReadResponse,
  },
};

exports.DBClient = grpc.makeGenericClientConstructor(DBService);
