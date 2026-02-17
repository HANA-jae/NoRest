import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '현재 사용자 프로필 조회' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.usersService.findById(userId);
    return this.toResponseDto(user);
  }

  @Patch('me')
  @ApiOperation({ summary: '현재 사용자 정보 수정' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, updateUserDto);
    return this.toResponseDto(user);
  }

  @Patch('me/password')
  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiResponse({ status: 200 })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(userId, dto.currentPassword, dto.newPassword);
    return { message: '비밀번호가 변경되었습니다' };
  }

  @Get()
  @ApiOperation({ summary: '전체 사용자 조회' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => this.toResponseDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 사용자 조회' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return this.toResponseDto(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return this.toResponseDto(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: '사용자가 삭제되었습니다' };
  }

  private toResponseDto(user: any): UserResponseDto {
    const { password, history, provider, providerId, ...dto } = user;
    return dto as UserResponseDto;
  }
}
