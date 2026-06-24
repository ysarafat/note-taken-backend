import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    const newNote = await this.prismaService.note.create({
      data: {
        title: createNoteDto.title,
        description: createNoteDto.description,
        userId,
      },
    });
    return newNote;
  }

  async findAll() {
    const notes = await this.prismaService.note.findMany();
    return notes;
  }

  findOne(id: string) {
    return `This action returns a #${id} note`;
  }

  update(id: string, _updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: string) {
    return `This action removes a #${id} note`;
  }
}
