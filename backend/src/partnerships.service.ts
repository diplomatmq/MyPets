import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { randomBytes } from 'node:crypto'

export type Partnership = { id: string; userA: number; userB: number; status: 'active'; createdAt: string }
export type Invite = { token: string; inviterId: number; expiresAt: string; used: boolean }

@Injectable()
export class PartnershipsService {
  private readonly invites = new Map<string, Invite>()
  private readonly partnerships: Partnership[] = []

  createInvite(inviterId: number) {
    const token = randomBytes(24).toString('base64url')
    const invite = { token, inviterId, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), used: false }
    this.invites.set(token, invite)
    return { token, deepLink: `https://t.me/YOUR_BOT?startapp=invite_${token}`, expiresAt: invite.expiresAt }
  }

  acceptInvite(token: string, accepterId: number) {
    const invite = this.invites.get(token)
    if (!invite || invite.used || Date.parse(invite.expiresAt) < Date.now()) throw new NotFoundException('Invite is invalid or expired')
    if (invite.inviterId === accepterId) throw new ConflictException('You cannot accept your own invite')
    if (this.partnerships.some((partnership) => partnership.userA === accepterId || partnership.userB === accepterId)) throw new ConflictException('User already has an active partnership')
    invite.used = true
    const partnership = { id: randomBytes(16).toString('hex'), userA: invite.inviterId, userB: accepterId, status: 'active' as const, createdAt: new Date().toISOString() }
    this.partnerships.push(partnership)
    return partnership
  }
}
