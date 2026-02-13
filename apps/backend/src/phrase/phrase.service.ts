import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phrase } from './entities/phrase.entity';

@Injectable()
export class PhraseService {
  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
  ) {}

  async getDailyPhrase(userId: string): Promise<{ text: string; category: string }> {
    const phrases = await this.phraseRepository.find();

    if (!phrases || phrases.length === 0) {
      throw new NotFoundException('등록된 문구가 없습니다');
    }

    const index = this.hashToIndex(userId, phrases.length);
    const phrase = phrases[index];

    return { text: phrase.text, category: phrase.category };
  }

  private hashToIndex(userId: string, count: number): number {
    const today = new Date().toISOString().slice(0, 10);
    const seed = `${userId}:${today}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % count;
  }
}
