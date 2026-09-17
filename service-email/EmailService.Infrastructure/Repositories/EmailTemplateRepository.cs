using EmailService.Domain.Entities;
using EmailService.Domain.Enums;
using EmailService.Domain.Interfaces;
using EmailService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EmailService.Infrastructure.Repositories;

public class EmailTemplateRepository : IEmailTemplateRepository
{
    private readonly EmailDbContext _context;

    public EmailTemplateRepository(EmailDbContext context)
    {
        _context = context;
    }

    public async Task<EmailTemplate?> ObtenirParTypeAsync(EmailType type)
    {
        return await _context.EmailTemplates
            .FirstOrDefaultAsync(t => t.Type == type && t.EstActif);
    }

    public async Task AjouterAsync(EmailTemplate template)
    {
        await _context.EmailTemplates.AddAsync(template);
        await _context.SaveChangesAsync();
    }
}