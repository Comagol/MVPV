import { VoteDao } from "../dao/VoteDao";
import { VoteResponse, VoteRequest, VoteStatistics, VoteValidationResponse } from "../types/vote.types";
import { IVote } from "../models/Vote";
import { MatchDao } from "../dao/MatchDao";
import { PlayerDao } from "../dao/PlayerDao";

export class VoteService {
 private voteDao: VoteDao;
 private matchDao: MatchDao;
 private playerDao: PlayerDao;

 constructor() {
  this.voteDao = new VoteDao();
  this.matchDao = new MatchDao();
  this.playerDao = new PlayerDao();
 }

 // formatear la respuesta para el frontend
 private formatVoteResponse(vote: IVote): VoteResponse {
  return {
    id: vote._id.toString(),
    playerId: vote.playerId.toString(),
    matchId: vote.matchId.toString(),
    fechaVoto: vote.fechaVoto
  }
 }
}