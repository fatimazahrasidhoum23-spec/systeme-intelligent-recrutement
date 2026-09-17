using EmailService.Domain.Entities;
using EmailService.Domain.Interfaces;
using EmailService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EmailService.Infrastructure.Repositories;

public class EmailLogRepository : IEmailLogRepository
{
    private readonly EmailDbContext _context;

    public EmailLogRepository(EmailDbContext context)
    {
        _context = context;
    }

    public async Task AjouterAsync(EmailLog log)
    {
        await _context.EmailLogs.AddAsync(log);
        await _context.SaveChangesAsync();
    }

    public async Task<List<EmailLog>> ObtenirTousAsync()
    {
        return await _context.EmailLogs
            .OrderByDescending(l => l.DateEnvoi)
            .ToListAsync();
    }

    public async Task<EmailLog?> ObtenirParIdAsync(int id)
    {
        return await _context.EmailLogs.FindAsync(id);
    }
}